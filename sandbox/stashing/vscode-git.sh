#!/bin/bash

git ls-files --stage -- /home/andrii/code/private/git-hooks-wrapper/sandbox/stashing/repo/staged_modified
git cat-file -s 1dae84ef9ad204c147621e070727982559f56ab4
git show :staged_modified
git status -z -u
git symbolic-ref --short HEAD
git rev-parse master
git rev-parse --symbolic-full-name master@{u}
fatal: no upstream configured for branch 'master'
git for-each-ref --format %(refname) %(objectname) --sort -committerdate
git remote --verbose
git config --get commit.template
