#!/bin/bash

cd aap-poc && yarn build
cp tools/package.json build/

cd build
zip -r ./aap-poc-1.0.zip .

echo publish to dropbox
../../../datacenter/release.sh aap-poc








