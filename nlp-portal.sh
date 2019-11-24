#!/bin/bash

declare -x MAIN_DIR=$(pwd)
declare -x LOG_DIR=$MAIN_DIR/logs
declare -x TRAIN_DIR=$MAIN_DIR/nlp-training
declare -x PORTAL_DIR=$MAIN_DIR/nlp-portal
declare -x CLIENT_DIR=$MAIN_DIR/nlp-server

# Run Portal
cd $PORTAL_DIR
npm install
./build-dist.sh && npm start



