#!/bin/bash
configPath="gitconfig" # dot will be added later
myname="git-hooks-wrapper"
mydir="./node_modules/git-hooks-wrapper/hooks" 
scriptsPath="git-hooks"
# TODO includeif
git config --get include.path "^\.\./\.$configPath$" \
|| git config --add include.path ../."$configPath"

configPath=".$configPath"
#TODO not reassign
git config --file "$configPath" "$myname".scriptsPath "$scriptsPath" 
git config --file "$configPath" core.hooksPath "$mydir"
