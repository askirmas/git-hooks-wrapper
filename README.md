# git-hooks-wrapper

Make usage of git hooks easy in project of any programming language and any platform. Works on Windows with [git bash](https://git-scm.com/download/win). 

## Installation

| Language                                                | Install                         | Command Execution     |
| ------------------------------------------------------- | ------------------------------- | --------------------- |
| [Node](https://www.npmjs.com/package/git-hooks-wrapper) | `npm install git-hooks-wrapper` | npx git-hooks-wrapper |
| Python                                                  | TBD pypi pip                    |                       |
| PHP                                                     | TBD Composer PEAR Packagist     |                       |
| ...                                                     |                                 |                       |

## Basic Usage

After install automatically runs `init` wrapping `$PWD/git-hooks` folder by default. Folder can be changed by running pattern

``` bash
$ $main init $hooksDirecotory
```

This project uses itself so use [./git-hooks](./git-hooks) as examples

In addition to [init](./scripts/init) and hooks there are several useful scripts in [./utils](./utils) that can be run with pattern
```bash
$ $main $command $@
```
## Wrappers Functionality

### pre-commit

Removes untracked files and recovers them afterwards. I.e. ensures that test are running without side-effects. Produced files will be added to index if this step was successful.

## Commands list

```bash
$ $main
# SCRIPTS:
- init
- test
# HOOKS:
- applypatch-msg
- commit-msg
- fsmonitor-watchman
- p4-pre-submit
- post-applypatch
- post-checkout
- post-commit
- post-index-change
- post-merge
- post-receive
- post-rewrite
- post-update
- pre-applypatch
- pre-auto-gc
- pre-commit
- pre-merge-commit
- prepare-commit-msg
- pre-push
- pre-rebase
- pre-receive
- push-to-checkout
- sendemail-validate
- update
# UTILS:
- forceupdate
- forceupdate_submodules
- getbranch
- getRefsBranch
- getRemote
- stash_untracked
- stats
```

## TBD

### prepare-commit-msg

Add argument with stats overview 

### commit-msg

Add arguments with message uniqueness and open issue existence 

## Further reading

### About hooks

https://git-scm.com/docs/githooks

https://www.atlassian.com/git/tutorials/git-hooks


### pre-commit

[https://codeinthehole.com/tips/tips-for-using-a-git-pre-commit-hook/](https://codeinthehole.com/tips/tips-for-using-a-git-pre-commit-hook/)

