#!/bin/bash
MY_DIR=$(dirname ${BASH_SOURCE[0]})

GIT_PATH=$(git config --local --get core.hookPath || echo ".git/hooks")

test -e $GIT_PATH/pre-commit || ln -s $GIT_PATH/pre-commit $MY_DIR/pre-commit 

HOOKS_DIR=$(cat $MY_DIR/hooks_dir)

test -d $HOOKS_DIR || mkdir $HOOKS_DIR
