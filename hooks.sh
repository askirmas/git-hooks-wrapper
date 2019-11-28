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

case "$1" in
  --pre-commit)
    $MY_DIR/hooks/pre-commit
  ;;
  *)
    $MY_DIR/hooks/init.sh "$@"
  ;;
esac
exit $?