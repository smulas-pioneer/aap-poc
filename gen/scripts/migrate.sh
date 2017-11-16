#!/bin/bash

# Restart DB Docker
# cd ../db
# yarn start

# back to webapi
# cd ../webapi

tsc 
source ./scripts/.env 
export DB_HOST
export DB_NAME
export DB_USER
export DB_PASSWORD
export PORT

node build/migration/batch.js


















































