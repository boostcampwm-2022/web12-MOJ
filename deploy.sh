#! /bin/bash
git pull
cd client
yarn install
yarn build
pm2 restart moj_client
