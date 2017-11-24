#!/bin/bash

docker run -v ${PWD}:/app \
           --name docker-build-aap-poc \
           -w /app  \
           --rm node yarn  && yarn build

           