#!/bin/bash

declare -x MAIN_DIR=$(pwd)
declare -x LOG_DIR=$MAIN_DIR/logs
declare -x TRAIN_DIR=$MAIN_DIR/training
declare -x PORTAL_DIR=$MAIN_DIR/portal
declare -x CLIENT_DIR=$MAIN_DIR/client

# Run Client
cd $CLIENT_DIR
python ws_api_client.py




