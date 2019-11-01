#/bin/sh

case "$1" in
  --pre-commit)
    hooks/pre-commit
  ;;
  *)
    hooks/init.sh
  ;;
esac
exit $?