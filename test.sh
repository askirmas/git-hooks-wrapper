#!/bin/sh -x
reset=\\e[0m

HOOKS=$(cat hooks/hooks_dir)
./hooks.sh $HOOKS

_it() {
  echo -e "\e[1;30;42m TEST \e[0;1;4m $1 $reset"
}
_commit() {
  echo "$1" >> file;
  git add file && git commit -avm "$1" || _failed;
}

_failed() {
  echo -e "\e[1;41m FAILED $reset$1"
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
if [ "$?" != 0 ]
then
  _failed "$test"
fi

test="init"
_it "$test"
$MY_DIR/hooks.sh $HOOKS
#TODO check that $(uname) not starts with MINGW 
HOOKS_CONFIG=$(git config --get core.hooksPath | sed -e 's/^\([A-Z]\):/\/\1/' | tr '[:upper:]' '[:lower:]')
if [ "$HOOKS_CONFIG" != "$MY_DIR/hooks" ]
then
  echo "$HOOKS_CONFIG != $MY_DIR/hooks"
  _failed "$test"
fi

cp -rf "$MY_DIR/tests/exit0.sh" "$HOOKS/pre-commit"
git add "$HOOKS/pre-commit"
git commit -nm "init pre-commit"

test="pre-commit exit0"
_it "$test"
_commit "$test"
if [ "$?" != 0 ]
then
  _failed "$test"
fi
exit;

cp -rf "$MY_DIR/tests/exit1.sh" "$HOOKS/pre-commit" || exit 1;
git commit -anm "bad pre-commit"
test="pre-commit exit1"
_it "$test"
_commit "$test"
if [ "$?" = 0 ]
then
  _failed "$test"
fi

#it stash push;
#it commit interuption;
test="stash pop"
_it "$test"
touch "tostash"
_commit "$test"
if [ $? = 0  ]
then
  _failed "$test"
else 
  test="check appearance"
  it "$test"
  test -e "tostash"
  if [ $? != 0  ]
  then
    _failed "$test"
  fi
fi
