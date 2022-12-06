#!/bin/bash
cd scoring-server

docker build --tag scoring_docker -f ./docker/Dockerfile ./

yarn install
yarn build

pm2 restart moj_scoring_server
cd ..
