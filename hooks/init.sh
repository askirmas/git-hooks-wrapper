#!/bin/bash
GIT_PATH=$(git config --local --get core.hookPath || echo ".git/hooks")
MY_DIR=$(dirname ${BASH_SOURCE[0]})

ln -s $GIT_PATH/pre-commit $MY_DIR/pre-commit
