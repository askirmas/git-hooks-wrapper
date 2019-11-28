#!/bin/bash
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