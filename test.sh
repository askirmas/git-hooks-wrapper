#!/bin/sh
HOOKS=$(cat hooks/hooks_dir)
./hooks.sh $HOOKS

_commit() {
  echo "1" >> file;
  git commit -am "readme";
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
touch file
git add file

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

touch "$HOOKS/pre-commit"
chmod +x "$HOOKS/pre-commit"
git add "$HOOKS/pre-commit"


echo "TEST: good at pre-commit";
cp -rf "$MY_DIR/tests/exit0.sh" "$HOOKS/pre-commit"
_commit
if [ $? != 0 ]
then
  _failed
fi

echo "TEST: bad at pre-commit";
cp -rf "$MY_DIR/tests/exit1.sh" "$HOOKS/pre-commit"
_commit
if [ $? = 0 ]
then
  _failed
fi

#echo "TEST: stash push";
#echo "TEST: commit interuption";
echo "TEST: stash pop";
touch "tostash"
_commit
if [ $? = 0  ]
then
  _failed
else 
  echo "check appearance"
  test -e "tostash"
  if [ $? != 0  ]
  then
    _failed
  fi
fi
