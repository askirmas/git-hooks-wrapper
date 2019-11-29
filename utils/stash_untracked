#!/bin/bash
git stash push -q --keep-index --include-untracked -m "$1" && \
git clean -f
exit $?
