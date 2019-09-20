#!/bin/sh
git fetch && \
git reset --hard origin/"$1s"
git submodule sync --recursive
git submodule foreach --recursive git reset --hard && \
git submodule update --init --recursive
