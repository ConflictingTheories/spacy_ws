#!/bin/bash

declare -x MAIN_DIR=$(pwd)
declare -x LOG_DIR=$MAIN_DIR/logs
declare -x TRAIN_DIR=$MAIN_DIR/training
declare -x PORTAL_DIR=$MAIN_DIR/portal
declare -x CLIENT_DIR=$MAIN_DIR/client

# Run Client
cd $TRAIN_DIR
python generic_redaction_spacy_train.py
python generic_report_spacy_train.py




