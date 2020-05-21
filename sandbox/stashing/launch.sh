#!/bin/bash
rm -rf repo
mkdir repo
cd repo
git init

echo commited > commited
echo staged_modified > staged_modified
echo notstaged_modified > notstaged_modified
echo staged_deleted > staged_deleted
echo notstaged_deleted > notstaged_deleted

git add . && git commit -m "Init commit"

find . -iname "*_deleted" -exec rm {} \;

echo "\nnew" >> staged_modified
echo "\nnew" >> notstaged_modified

echo staged_new >> staged_new
echo untracked >> untracked

git add "staged_*"

# <script>
#checksum=($(echo $(realpath .)$(git rev-parse --abbrev-ref HEAD)$(git rev-parse HEAD) | md5sum)$(git remote get-url origin))
# git diff-index HEAD -s --quiet
iam="git-hooks-wrapper"
mkdir -p "$(dirname $(mktemp -u))/$iam"
tmpName=($(echo $(realpath .)$(git rev-parse --abbrev-ref HEAD)$(git rev-parse HEAD)$(git remote get-url origin) | md5sum))


notstagedPatch="$tmp/notstaged.patch"
git diff --full-index --binary > "$notstagedPatch"
git restore "*"; git clean -qf; git clean -qfd;

stageMsg="staged-$tmpName"
git stash -qum "$stageMsg"

git apply --binary "$notstagedPatch"
git stash --quiet --include-untracked --message "$tmpName"
git stash pop -quiet stash@{1}
# </script>

git checkout -b staged
git commit -m "staged"
git checkout master

# <on sigterm>
# separate script
# git stash pop --quiet stash@{$(git stash list -n 1 --grep \'"$tmpName"$\' | grep -oP 'stash@\{[\d]+\}')}
# </on sigterm>
