#!/bin/sh
git fetch && \
git reset --hard "${1:-origin/master}"
$(dirname "$0")/forceupdate_submodules.sh
