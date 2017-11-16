#!/bin/bash

set -e 

# Remove _db
rm -rf _db

# Copy _db
cp -r ../aap-poc/src/_db/common .

# Compile
tsc 

# Run
node build/index.js


cp build/output/*.json ../aap-poc/public/


















































