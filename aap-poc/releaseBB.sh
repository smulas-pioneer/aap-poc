npm version patch -f

PACKAGE_VER=$(node -pe "require('./package.json').version")
APP_NAME=$(node -pe "require('./package.json').name")
APP_NAME=aap-poc

# Build
yarn build

cp ./package.json ./build/
echo "var j=require('./build/package.json');var fs=require('fs');j.scripts={start: 'port=8080 serve'};j.devDependencies={};fs.writeFileSync('./build/package.json',JSON.stringify(j,null,2));true">copyPackage.js
node ./copyPackage.js
rm ./copyPackage.js

# config.json
echo "var j=require('./build/config.json');var fs=require('fs');j.APPNAME='aap-poc';fs.writeFileSync('./build/config.json',JSON.stringify(j,null,2));true">changeConfig.js
node ./changeConfig.js
rm ./changeConfig.js


# Inject Configuration
echo "PORT=8080">./build/.env
echo "export PORT">>./build/.env

# Zip Artifact
cd ./build
zip -r ./${APP_NAME}-${PACKAGE_VER}.zip .
cp ./${APP_NAME}-${PACKAGE_VER}.zip ./${APP_NAME}-latest.zip

# Publish to BITBUCKET Downloads using datacenter
../../../datacenter/releaseBB.sh ${APP_NAME} ${APP_NAME}

