#! /bin/bash
git pull
cd client
yarn build
pm2 restart moj_client