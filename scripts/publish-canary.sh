#!/usr/bin/env bash

npm version --no-git-tag-version --preid canary-$(git rev-parse HEAD) prerelease
npm publish --tag canary
git checkout .