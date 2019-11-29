#!/bin/sh
git submodule sync --recursive
git submodule foreach --recursive git reset --hard && \
git submodule update --init --recursive
