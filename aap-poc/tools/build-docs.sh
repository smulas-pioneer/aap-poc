#!/bin/bash

# yarn build-docs

docker run -v $(pwd)/../docs:/home/user \
           --name COMPILE_BEAUTY_PARADE \
           --rm thinkcube/mkdocs mkdocs build --clean

rm -rf public/docs
cp -R ../docs/site public/docs