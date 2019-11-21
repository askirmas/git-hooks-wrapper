#!/bin/sh
./hooks.sh

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

git init

echo "TEST: init";
$MY_DIR/hooks.sh $HOOKS
if [ $(git config --get core.hooksPath) != "$MY_DIR/hooks" ]
then
  _failed
fi

echo "TEST: commit without hooks";
touch readme.md
git add --all && git commit -a -m "readme"
if [ $? != 0 ]
then
  _failed
fi

cd $MY_DIR