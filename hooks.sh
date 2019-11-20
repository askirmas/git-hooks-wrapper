#/bin/bash
MY_DIR=$(dirname ${BASH_SOURCE[0]})

case "$1" in
  --pre-commit)
    $MY_DIR/hooks/pre-commit
  ;;
  *)
    $MY_DIR/hooks/init.sh "$@"
  ;;
esac
exit $?