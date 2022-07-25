#!/usr/bin/env bash

issemver=$(./scripts/check-semver.sh -t "$TAG_NAME")
currenttag=$(npm pkg get version)

git config user.name github-actions
git config user.email github-actions@github.com

if [ "$issemver" -eq "1" ]; then
    if ! [ "$currenttag" = "\"$TAG_NAME\"" ]; then
        echo "Branch tag is different than packge.json version. Updating package.json version to $TAG_NAME"
        npm version "$TAG_NAME"
        git push --no-verify
    fi
    echo "Publishing to npm"
    npm publish
fi