#!/bin/bash
set -x

export root=../../deploy
export curdir=$(pwd)

echo $root
echo $curdir

echo Create Deploy Directory
rm -rf $root
mkdir $root

echo Clone Deploy Repo
cd $root
git clone https://github.com/PIONEER-INVESTMENTS/mildev-aap-poc-deploy.git

echo Clear Prev version
rm -rfv $root/mildev-aap-poc-deploy/*

echo Copy Deployment
cp -R $curdir/build/ $root/mildev-aap-poc-deploy/

echo GIT Add and Commit
cd $root/mildev-aap-poc-deploy
git add *
git commit -m deploy

echo PUSH
git push origin master

cd $curdir

