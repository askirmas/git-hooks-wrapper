#!/bin/bash
MY_DIR=$(dirname "$(realpath "$0")")

if [ -z "$1" ]
then
  HOOKS_PATH="git-hooks"
else
  HOOKS_PATH=$1
fi

echo -n "$HOOKS_PATH" > "$MY_DIR/hooks_dir"

git config --local core.hooksPath "$MY_DIR"

echo "Wrapped git hooks in folder '$HOOKS_PATH': $(git config --local --get core.hooksPath)"
exit 0;