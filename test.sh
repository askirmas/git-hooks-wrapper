#!/bin/bash
reset=\\033[0m

HOOKS=$(cat hooks/hooks_dir)
./main.sh $HOOKS

_it() {
  echo -e "\033[1;30;43m TEST \033[0m \033[1;4m$1$reset"
}
_commit() {
  echo "$1" >> file
  git add file && git commit -avm "$1"
  return $?
}

_passed() {
  echo "$1"
  echo -e "\033[1;30;42m PASSED \033[0;1;4m $1 $reset"
}
_failed() {
  echo -e "\033[1;41m FAILED $reset $1";
  exit 1;
}

MY_DIR=$(dirname "$(realpath "$0")")
HOOKS=$(cat hooks/hooks_dir)
REPO="repo"

rm -rf $REPO
mkdir $REPO
cd $REPO
mkdir $HOOKS

git init
touch file
git add file

test="first commit without hooks"
_it "$test"
_commit "$test"
[ "$?" == 0 ] || _failed "$test"

test="init"
_it "$test"
$MY_DIR/main.sh $HOOKS

HOOKS_CONFIG=$(git config --get core.hooksPath | sed -e 's/^\([A-Z]\):/\/\1/' | tr '[:upper:]' '[:lower:]')
[ "$HOOKS_CONFIG" == $(echo "$MY_DIR/hooks" | tr '[:upper:]' '[:lower:]') ] \
||  _failed "$test: $HOOKS_CONFIG != $MY_DIR/hooks"

cp -rf "$MY_DIR/tests/exit0.sh" "$HOOKS/pre-commit"
git add "$HOOKS/pre-commit"
git commit -nm "init pre-commit"

test="pre-commit exit0"
_it "$test"
_commit "$test"
[ $? == 0 ] || _failed "$test"

test="delete file"
rm -rf file
_it "$test"
git commit -avm "$test" && (test -e file; [ $? == 1 ]) 
result=$?
[ $result == 0 ] || _failed "$test: $result"

_commit "recover file"

cp -rf "$MY_DIR/tests/exit1.sh" "$HOOKS/pre-commit" || exit 1;
git commit -anm "bad pre-commit"

test="pre-commit exit1"
_it "$test"
_commit "$test"
[ $? != 0 ] ||  _failed "$test"

test="stash pop"
touch "tostash"
_it "$test"
_commit "$test"
[ $? != 0  ] || _failed "$test"

test="check appearance"
_it "$test"
test -e "tostash"
[ "$?" == 0  ] || _failed "$test"

rm -rf file
git add file && git commit -avm "$test"
test="delete file"
_it "$test"
test -e file 
[ $? == 1 ] || _failed "$test"

#it commit interuption;

echo -e "\n\033[1;30;42m DONE \033[0m"