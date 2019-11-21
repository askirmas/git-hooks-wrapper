#!/bin/sh
./hooks.sh

_commit() {
  touch file;
  echo "1" >> file;
  git add --all && git commit -a -m "readme";
}

_failed() {
  echo "FAILED"
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

echo "TEST: init";
$MY_DIR/hooks.sh $HOOKS
if [ $(git config --get core.hooksPath) != "$MY_DIR/hooks" ]
then
  _failed
fi


echo "TEST: commit without hooks";
_commit
if [ $? != 0 ]
then
  _failed
fi

echo "TEST: bad commit";
cp -rf "$MY_DIR/tests/exit1.sh" "$HOOKS/pre-commit"
_commit
if [ $? = 0 ]
then
  _failed
fi

echo "TEST: good commit";
cp -rf "$MY_DIR/tests/exit0.sh" "$HOOKS/pre-commit"
_commit
if [ $? != 0 ]
then
  _failed
fi
