#!/bin/bash
MY_DIR=$(dirname ${BASH_SOURCE[0]})

GIT_PATH=$(git config --local --get core.hookPath || echo ".git/hooks")

ln -s $GIT_PATH/pre-commit $MY_DIR/pre-commit

HOOKS_DIR=$(cat $MY_DIR/hooks_dir)

mkdir $HOOKS_DIR >/dev/null 2>&1
