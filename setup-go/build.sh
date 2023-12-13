#!/bin/bash

set -eou pipefail

leaf_dir="$DESTINATION_DIR"/setup-go

rm -rf "$leaf_dir"
mkdir "$leaf_dir"
cp mint-leaf.yml "$leaf_dir"/mint-leaf.yml
mkdir "$leaf_dir"/bin
cp bin/* "$leaf_dir"/bin/
