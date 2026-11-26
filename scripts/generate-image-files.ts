import { parse, stringify } from "@std/yaml";
import { emptyDirSync, ensureDirSync } from "@std/fs";

// All paths are relative to the repository root, so make the script independent of where it is started from
Deno.chdir(new URL("..", import.meta.url));

const sourceDirectory = 'source';
const imagesDirectory = 'images';

/**
 * Types and helpers
 */
type ImageConfig = {
  "name": string;
  "tags": string[];
  "package-name": string;
  "package-version": string;
};

const dockerTagPattern = /^\w[\w.-]{0,127}$/;

// The values end up in a shell script (custom-setup.sh), so only allow harmless characters
const fieldPatterns: Record<string, RegExp> = {
  "package-name": /^[a-z0-9_]+$/,
  "package-version": /^[\w.+-]+$/,
};

const requiredFields = ["name", "tags", "package-name", "package-version"] as const;

function fail(message: string): never {
  console.error(message);
  Deno.exit(1);
}

/**
 * Prepare image configuration
 */
const imageConfiguration = parse(Deno.readTextFileSync(`${sourceDirectory}/images.yml`)) as { images?: unknown } | null;

if (imageConfiguration === null || typeof imageConfiguration !== "object") {
  fail("Invalid image configuration!");
}

const images = imageConfiguration["images"];

if (!Array.isArray(images)) {
  fail("Invalid images array!");
}

// Validate everything before touching the images directory, so that a broken configuration leaves it untouched
images.forEach((image: Record<string, unknown> | null, index: number) => {
  if (image === null || typeof image !== "object") {
    fail(`Invalid image configuration at index ${index}!`);
  }
  for (const field of requiredFields) {
    const value = image[field];
    const label = `Image "${image["name"] ?? index}"`;
    if (field === "tags") {
      if (!Array.isArray(value) || value.length === 0) {
        fail(`${label}: missing or empty field "${field}"!`);
      }
      // Tags must be real strings (YAML turns e.g. `1.0` into a number) in Docker tag format
      for (const tag of value) {
        if (typeof tag !== "string" || !dockerTagPattern.test(tag)) {
          fail(`${label}: invalid tag ${JSON.stringify(tag)}! Tags must be quoted strings, e.g. "1.0".`);
        }
      }
    } else if (typeof value !== "string" || value.trim() === "") {
      // Do not coerce other types: an unquoted `1.10` is parsed as the number 1.1
      fail(`${label}: field "${field}" must be a non-empty string (hint: quote the value in images.yml)!`);
    } else if (fieldPatterns[field] !== undefined && !fieldPatterns[field].test(value)) {
      fail(`${label}: field "${field}" has an invalid value ${JSON.stringify(value)}! Expected to match ${fieldPatterns[field]}.`);
    }
  }
});

if (images.length === 0) {
  fail("No images configured!");
}

const imageList = images as ImageConfig[];

// The name is used as directory name and as key in the workflows, so it must be safe and unique
const imageNames = new Set<string>();
for (const image of imageList) {
  const name = image["name"];
  if (!/^[\w.-]+$/.test(name) || name.startsWith(".")) {
    fail(`Invalid image name "${name}"! Allowed: letters, digits, "_", "-" and "." (not at the start).`);
  }
  if (imageNames.has(name)) {
    fail(`Duplicate image name "${name}"!`);
  }
  imageNames.add(name);
}

// The same tag on several images would make the publish jobs overwrite each other
const tagOwners = new Map<string, string>();
for (const image of imageList) {
  for (const tag of image["tags"]) {
    const owner = tagOwners.get(tag);
    if (owner !== undefined) {
      fail(`Tag "${tag}" is used by both "${owner}" and "${image["name"]}"!`);
    }
    tagOwners.set(tag, image["name"]);
  }
}

/**
 * Generate custom-setup.sh files
 * Hint: everything is generated in memory first, so that invalid configuration or missing/invalid source files
 * leave the images directory untouched (I/O errors while writing below can still leave it incomplete)
 */
const customSetupFileSource = Deno.readTextFileSync(`${sourceDirectory}/custom-setup.sh`);

// Static files that do not require replacements, also read up front so that a missing file cannot fail after the cleanup
const staticFiles = new Map(
  [`Dockerfile`].map((file) => [file, Deno.readTextFileSync(`${sourceDirectory}/${file}`)] as const),
);

const customSetupFiles = imageList.map((image) => {
  const replacements: Record<string, string> = {
    'PACKAGE_NAME': image["package-name"],
    'PACKAGE_VERSION': image["package-version"],
  };

  // Replace all placeholders in a single pass, so that replaced values are never processed again
  return customSetupFileSource.replaceAll(/%%(\w+)%%/g, (placeholder, key: string) => {
    if (!Object.hasOwn(replacements, key)) {
      fail(`Image "${image["name"]}": unknown placeholder ${placeholder} in ${sourceDirectory}/custom-setup.sh!`);
    }
    return replacements[key];
  });
});

/**
 * Clear images directory
 * Hint: we want all images to be removed that are no longer contained in the image configuration
 */
emptyDirSync(imagesDirectory);

/**
 * Generate images
 */
imageList.forEach((image, index) => {
  const targetDir = `${imagesDirectory}/${image["name"]}`;
  ensureDirSync(targetDir);

  Deno.writeTextFileSync(`${targetDir}/custom-setup.sh`, customSetupFiles[index]);

  staticFiles.forEach((content, file) => {
    Deno.writeTextFileSync(`${targetDir}/${file}`, content);
  });

  /**
   * Generate tag list
   */
  const tagList = stringify({ tags: image["tags"] });
  Deno.writeTextFileSync(`${targetDir}/tags.yml`, tagList);
});
