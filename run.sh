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
${SCRIPT_DIR}/nlp-server.sh > ${MAIN_DIR}/logs/server.run.log &
echo -e 'STARTING UP CLIENT...'
sleep 10

${SCRIPT_DIR}/nlp-portal.sh > ${MAIN_DIR}/logs/portal.run.log &
echo -e 'STARTING UP PORTAL...'
sleep 5


echo -e "NLP Websocket Running @ ${WS_PROTOCOL}${WS_HOST}:${WS_PORT}"
echo -e "NLP Portal Running @ ${NLP_PROTOCOL}${NLP_HOST}:${PORT}"
echo -e "\n\n---NLP Server Internally available @ ${WS_PROTOCOL}localhost:${WS_PORT}"
echo -e "---NLP Portal Internally available @ ${NLP_PROTOCOL}localhost:${PORT}\n\n"