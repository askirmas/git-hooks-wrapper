#!/bin/bash
MY_DIR=$(dirname "$(realpath "$0")")
CMD="$1"; shift
test -e "$MY_DIR/hooks/$CMD" && ($MY_DIR/hooks/$CMD $@; exit $?)
test -e "$MY_DIR/scripts/$CMD.sh" && ($MY_DIR/scripts/$CMD.sh $@; exit $?)
exit $?