#!/bin/bash
set -e


# What is this post_push.sh?
# It's the template for the post_push hook we use to push all image tags to Docker Hub.
# https://docs.docker.com/docker-hub/builds/advanced/#custom-build-phase-hooks


for tag in %%TAGS%%; do

    docker tag $IMAGE_NAME $DOCKER_REPO:$tag
    docker push $DOCKER_REPO:$tag

    echo "$DOCKER_REPO:$tag"
done
