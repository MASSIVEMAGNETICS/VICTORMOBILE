#!/bin/bash
source ~/.nvm/nvm.sh
nvm use 16
cd ~/victor-dashboard
npm start > npm_output.log 2>&1 &
