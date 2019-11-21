#!/bin/sh
MY_DIR=$(dirname "$(realpath "$0")")
HOOKS=$(cat hooks/hooks_dir)
REPO="repo"

rm -rf $REPO
mkdir $REPO
cd $REPO
#exec bash
git init

echo "Init";
$MY_DIR/hooks.sh $HOOKS
if [ $(git config --get core.hooksPath) != "$MY_DIR/hooks" ]
then
  echo "git config --get core.hooksPath failed"
  exit 1;
fi

cd $MY_DIR
rm -rf $REPO