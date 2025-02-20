#!/usr/bin/env bash

set -ueo pipefail

mkdir bin
pushd build

echo "Building the patterns binary"
go build -o ../bin/glob_patterns ./glob_patterns.go

popd

echo "Removing the build directory"
rm -rf build
