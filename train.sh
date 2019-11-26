#!/bin/bash

# ============================
# NLP Example Setup Script
# ----------------------------
# Author: Kyle Derby MacInnis
#
# 2019 (c) Kyle Derby MacInnis
# ============================

source .env
export MAIN_DIR=$(pwd)
export SCRIPT_DIR=${MAIN_DIR}/nlp-scripts

# Make training folder
echo -e 'TRAINING CLIENT...'
${SCRIPT_DIR}/nlp-train.sh
