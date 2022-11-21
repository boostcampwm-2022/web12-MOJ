#!/bin/bash
cd server
yarn install
yarn build
pm2 restart moj_server
cd ..