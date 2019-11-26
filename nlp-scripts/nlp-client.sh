#!/bin/bash

declare -x LOG_DIR=$MAIN_DIR/logs
declare -x TRAIN_DIR=$MAIN_DIR/nlp-training
declare -x PORTAL_DIR=$MAIN_DIR/nlp-portal
declare -x CLIENT_DIR=$MAIN_DIR/nlp-server

# Run Client
cd $CLIENT_DIR
python ws_api_client.py




