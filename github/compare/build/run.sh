#!/usr/bin/env bash

set -ueo pipefail

mkdir bin
pushd build

echo "Building the filter binary"
go build -o ../bin/glob_filter ./glob_filter.go

popd

echo "Removing the build directory"
rm -rf build
