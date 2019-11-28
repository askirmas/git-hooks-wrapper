#!/bin/sh
realpath() {
  OURPWD=$PWD
  cd "$(dirname "$1")"
  LINK=$(readlink "$(basename "$1")")
  while [ "$LINK" ]; do
    cd "$(dirname "$LINK")"
    LINK=$(readlink "$(basename "$1")")
  done
  REALPATH="$PWD/$(basename "$1")"
  cd "$OURPWD"
  echo "$REALPATH"
}

MY_DIR=$(dirname "$(realpath "$0")")

if [ -z "$1" ]
then
  HOOKS_PATH="git-hooks"
else
  HOOKS_PATH=$1
fi

echo "$HOOKS_PATH" > "$MY_DIR/hooks_dir"

git config --local core.hooksPath $MY_DIR

echo "Wrapped git hooks in folder '$HOOKS_PATH': $(git config --local --get core.hooksPath)"
exit 0;