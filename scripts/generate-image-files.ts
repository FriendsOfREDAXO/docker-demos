import { isArray, isObject } from "std/yaml/_utils.ts";
import { parse, stringify } from "std/yaml/mod.ts";
import { emptyDirSync, ensureDirSync, copySync } from "std/fs/mod.ts";

const sourceDirectory = 'source';
const imagesDirectory = 'images';

/**
 * Prepare image configuration
 */
const imageConfiguration = parse(Deno.readTextFileSync(`${sourceDirectory}/images.yml`));

if (!isObject(imageConfiguration)) {
  console.error("Invalid image configuration!");
  Deno.exit(1);
}

const images = imageConfiguration["images"];

if (!isArray(images)) {
  console.error("Invalid images array!");
  Deno.exit(1);
}

/**
 * Clear images directory
 * Hint: we want all images to be removed that are no longer contained in the image configuration
 */
emptyDirSync(imagesDirectory);

/**
 * Generate images
 */
const customSetupFileSource = Deno.readTextFileSync(`${sourceDirectory}/custom-setup.sh`);

for (const image of images) {

  const targetDir = `${imagesDirectory}/${image["name"]}`;
  ensureDirSync(targetDir);

  /**
   * Generate custom-setup.sh
   */
  const replacements: Record<string, string> = {
    '%%PACKAGE_NAME%%': `${image["package-name"]}`,
    '%%PACKAGE_VERSION%%': `${image["package-version"]}`,
  };
  let currentCustomSetupFileSource = customSetupFileSource;
  Object.keys(replacements).forEach((key) => {
    currentCustomSetupFileSource = currentCustomSetupFileSource.replaceAll(key, replacements[key]);
  });

  Deno.writeTextFileSync(`${targetDir}/custom-setup.sh`, currentCustomSetupFileSource);

  /**
   * Copy static files that do not require replacements
   */
  const filesToCopy = [
    `Dockerfile`,
  ];
  filesToCopy.forEach(file => {
    copySync(`${sourceDirectory}/${file}`, `${targetDir}/${file}`);
  })

  /**
   * Generate tag list
   */
  const tagList = stringify({ tags: image["tags"] });
  Deno.writeTextFileSync(`${targetDir}/tags.yml`, tagList);
}
