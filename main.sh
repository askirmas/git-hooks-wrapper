#!/bin/bash
MY_DIR=$(dirname "$(realpath "$0")")
CMD="$1"; shift
test -e "$MY_DIR/hooks/$CMD" && ($MY_DIR/hooks/$CMD $@ >&1; exit $?)
test -e "$MY_DIR/scripts/$CMD.sh" && ($MY_DIR/scripts/$CMD.sh $@ >&1; exit $?)
exit $?