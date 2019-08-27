#!/usr/bin/env python3

# ============================
# Spacy.io - WS server example
# ----------------------------
# Author: Kyle Derby MacInnis
#
# 2019 (c) Kyle Derby MacInnis
# ============================

import asyncio
import websockets
import spacy
import json
import random

import plac
from pathlib import Path
from spacy.gold import GoldParse
from spacy.util import minibatch, compounding

# Load English tokenizer, tagger, parser, NER and word vectors
output_dir = Path('../training/model')
nlp = spacy.load(output_dir)
print("Loaded model")
# nlp = spacy.load("en_core_web_sm")

# Scan WS Msg and Parse with NLP
async def nlpScan(websocket, path):
    async for msg in websocket:
        print("receive < {}".format(msg))
        # Read in and Parse Result (NLP)
        doc = nlp(msg)
        # Analyze syntax
        print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
        print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

        # Find named entities, phrases and concepts
        entities = dict()
        for entity in doc.ents:
            print(entity.text, entity.label_)
            if(entity.label_ in entities):
                entities[entity.label_].append(entity.text)
            else:
                entities[entity.label_] = list()
                entities[entity.label_].append(entity.text)
        
        # Response
        result = json.dumps(entities)
        await websocket.send(result)

# Run WS Server
start_server = websockets.serve(nlpScan, "localhost", 8765)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

