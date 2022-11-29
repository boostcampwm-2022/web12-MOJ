#!/bin/bash
cd scoring-server
yarn install
yarn build
pm2 restart moj_scoring_server
cd ..
