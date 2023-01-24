#!/usr/bin/env bash

set -o verbose
set -o xtrace
set -o errexit

npm version --no-git-tag-version --preid canary-$(git rev-parse HEAD) prerelease
npm publish --tag canary
git checkout .
