#!/bin/bash

# ============================
# NLP Example Setup Script
# ----------------------------
# Author: Kyle Derby MacInnis
#
# 2019 (c) Kyle Derby MacInnis
# ============================

# Make training folder
mkdir training

# Install Libraries
sudo pip3 install spacy toolz pathlib ayncio

# Install Models for Spacy
sudo spacy download en_core_web_sm       # small
#spacy download en_core_web_md       # medium
#spacy download en_core_web_lg       # large

