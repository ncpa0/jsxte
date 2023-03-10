#!/usr/bin/env bash

set -o verbose
set -o xtrace
set -o errexit

issemver=$(./scripts/check-semver.sh -t "$TAG_NAME")
currenttag=$(npm pkg get version)

if [ "$issemver" -eq "1" ]; then
    if ! [ "$currenttag" = "\"$TAG_NAME\"" ]; then
        echo "Branch tag is different than packge.json version. Updating package.json version to $TAG_NAME"
        npm version "$TAG_NAME" --no-git-tag-version
        echo "Requesting GithubBot to bump the package.json version on the remote"
        node ./scripts/bump-remote.mjs "$TAG_NAME"
    fi
    echo "Publishing to npm"
    npm publish
fi
