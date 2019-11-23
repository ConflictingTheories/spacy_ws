#!/usr/bin/env python3

# ============================
# NLP Training NER Example
# ----------------------------
# Author: Kyle Derby MacInnis
#
# 2019 (c) Kyle Derby MacInnis
# ============================

import plac
import asyncio
import spacy
import random

from toolz import partition_all
from pathlib import Path
from spacy.gold import GoldParse
from spacy.util import minibatch, compounding

# Labels to Add to model
LABEL = ['PERSON', 'EMAIL', 'PHONE', 'RACIAL', 'TITLE', 'ADDRESS']

# NER Data for Training New data
TRAINING_DATA = [
    (
        "bomb", 
        {"entities": [(0,4, "WEAPON")]}
    ),
    (
        "bombs", 
        {"entities": [(0,5, "WEAPON")]}
    ),
    (
        "gun", 
        {"entities": [(0, 3, "WEAPON")]}
    ),
    (
        "guns", 
        {"entities": [(0, 4, "WEAPON")]}
    ),
    (
        "knife", 
        {"entities": [(0,5, "WEAPON")]}
    ),
    (
        "knives", 
        {"entities": [(0,6, "WEAPON")]}
    ),
    (
        "taser", 
        {"entities": [(0,5, "WEAPON")]}
    ),
    (
        "tasers", 
        {"entities": [(0,6, "WEAPON")]}
    ),
    (
        "he had a knife", 
        {"entities": [(9, 14, "WEAPON")]}
    ),
    (
        "he had a gun", 
        {"entities": [(9, 12, "WEAPON")]}
    ),
    (
        "he had a bomb", 
        {"entities": [(9, 13, "WEAPON")]}
    ),
    (
        "he had a weapon", 
        {"entities": [(9, 15, "WEAPON")]}
    ),
    (
        "he had a taser", 
        {"entities": [(9, 14, "WEAPON")]}
    ),
    (
        "she had a knife", 
        {"entities": [(10, 15, "WEAPON")]}
    ),
    (
        "she had a gun", 
        {"entities": [(10, 13, "WEAPON")]}
    ),
    (
        "she had a bomb", 
        {"entities": [(10, 14, "WEAPON")]}
    ),
    (
        "she had a weapon", 
        {"entities": [(10, 16, "WEAPON")]}
    ),
    (
        "she had a taser", 
        {"entities": [(10, 15, "WEAPON")]}
    ),
        (
        "they had a knife", 
        {"entities": [(11, 16, "WEAPON")]}
    ),
    (
        "he had a gun", 
        {"entities": [(11, 14, "WEAPON")]}
    ),
    (
        "he had a bomb", 
        {"entities": [(11, 15, "WEAPON")]}
    ),
    (
        "he had a weapon", 
        {"entities": [(11, 17, "WEAPON")]}
    ),
    (
        "he had a taser", 
        {"entities": [(11, 16, "WEAPON")]}
    ),
    (
        "someone had a knife", 
        {"entities": [(14, 19, "WEAPON")]}
    ),
    (
        "someone had a gun without ammo", 
        {"entities": [(14, 17, "WEAPON"),(26, 30, "WEAPON")]}
    ),
    (
        "someone had a bomb hidden", 
        {"entities": [(14, 18, "WEAPON")]}
    ),
    (
        "someone had a weapon and attacked", 
        {"entities": [(14, 20, "WEAPON")]}
    ),
    (
        "someone had a taser with them", 
        {"entities": [(14, 19, "WEAPON")]}
    ),
    (
        "he had a knife in his jacket", 
        {"entities": [(9, 14, "WEAPON")]}
    ),
    (
        "he had a gun without bullets", 
        {"entities": [(9, 12, "WEAPON"),(21, 28, "WEAPON")]}
    ),
    (
        "he had a bomb hidden in the ceiling", 
        {"entities": [(9, 13, "WEAPON")]}
    ),
    (
        "he had a weapon in the back", 
        {"entities": [(9, 15, "WEAPON")]}
    ),
    (
        "he had a taser stashed away", 
        {"entities": [(9, 14, "WEAPON")]}
    ),
    (
        "she had a knife drawn and ready", 
        {"entities": [(10, 15, "WEAPON")]}
    ),
    (
        "she had a gun in a holster", 
        {"entities": [(10, 13, "WEAPON")]}
    ),
    (
        "she had a bomb in her backpack", 
        {"entities": [(10, 14, "WEAPON")]}
    ),
    (
        "she had a weapon of unknown origin", 
        {"entities": [(10, 16, "WEAPON")]}
    ),
    (
        "she had a taser in her purse", 
        {"entities": [(10, 15, "WEAPON")]}
    ),
        (
        "they had a knife in their hands", 
        {"entities": [(11, 16, "WEAPON")]}
    ),
    (
        "he had a gun by the counter", 
        {"entities": [(11, 14, "WEAPON")]}
    ),
    (
        "he had a bomb in his bag", 
        {"entities": [(11, 15, "WEAPON")]}
    ),
    (
        "he had a weapon behind his back", 
        {"entities": [(11, 17, "WEAPON")]}
    ),
    (
        "he had a taser in his hand", 
        {"entities": [(11, 16, "WEAPON")]}
    ),
    (
        "someone had a knife in their pocket", 
        {"entities": [(14, 19, "WEAPON")]}
    ),
    (
        "someone had a gun concealed in their pants", 
        {"entities": [(14, 17, "WEAPON")]}
    ),
    (
        "someone had a bomb and a toothbrush", 
        {"entities": [(14, 18, "WEAPON")]}
    ),
    (
        "someone had a weapon under their coat", 
        {"entities": [(14, 20, "WEAPON")]}
    ),
    (
        "someone had a taser and was waving it around", 
        {"entities": [(14, 19, "WEAPON")]}
    )
]

# Retain NER Learning (will be generated from Revision Texts)
REVISION_DATA = []

# Recall Data Sets
REVISION_TEXT = [
    "John is a person who has worked for some companies.",
    "Google and Uber are big companies",
    "I have driven down the street",
    "Yesterday was a great day, but today is okay.",
    "Thursday was interesting",
    "Tomorrow will be fun."
    "Welcome to Canada - north of the USA",
    "I am wondering about tomorrow.",
    "Was he born yesterday?",
    "he had a toothbrush",
    "she had a toothbrush",
    "he had a bicycle",
    "she had a bicycle",
    "someone had a bicycle",
    "someone had a toothbrush",
    "do you have pen?",
    "do you have an item?"
    "they had a pizza",
    "they took an Uber",
    "someone saw a cab"
]

#  ---- TRAINING FUNTION -----
@plac.annotations(
    model=("Model name. Defaults to 'en' model.", "option", "m", str),
    new_model_name=("New model name for model meta.", "option", "nm", str),
    output_dir=("Optional output directory", "option", "o", Path),
    n_iter=("Number of training iterations", "option", "n", int))
    
def main(model=None, new_model_name='weapons', output_dir=None, n_iter=10):
    # Load Model
    if model is not None:
        nlp = spacy.load(model)
    else:
        nlp = spacy.load('en_core_web_sm')

    # Find NER Pipeline
    if 'ner' not in nlp.pipe_names:
        ner = nlp.create_pipe('ner')
        nlp.add_pipe(ner)
    else:
        ner = nlp.get_pipe('ner')

    # Add new entity labels to entity recognizer
    for i in LABEL:
        ner.add_label(i)
   
    # Inititalizing optimizer
    if model is None:
        optimizer = nlp.begin_training()
    else:
        optimizer = nlp.entity.create_optimizer()

    # Get names of other pipes to disable them during training to train # only NER and update the weights
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']
    with nlp.disable_pipes(*other_pipes):  # only train NER
        # Build Generate Training data using exist accuracy (NEEDS GOOD DATASET)
        for doc in nlp.pipe(REVISION_TEXT):
            tags = [w.tag_ for w in doc]
            heads = [w.head.i for w in doc]
            deps = [w.dep_ for w in doc]
            entities = [(e.start_char, e.end_char, e.label_) for e in doc.ents]
            REVISION_DATA.append((doc, GoldParse(doc, tags=tags, heads=heads,
                                                deps=deps, entities=entities)))
        # Train using Datasets
        for itn in range(n_iter):
            # Mix in generate data w/ training data
            examples = REVISION_DATA + TRAINING_DATA
            random.shuffle(examples)
            losses = {}
            batches = minibatch(examples, 
                                size=compounding(4., 32., 1.001))
            for batch in batches:
                texts, annotations = zip(*batch) 
                # Updating the weights
                nlp.update(texts, annotations, sgd=optimizer, 
                        drop=0.3, losses=losses)
            print('Losses', losses)

    # Test the trained model
    test_text = 'Kyle was a man who had a gun and threatened someone with a knife and said he had a bomb'
    doc = nlp(test_text)
    print("Entities in '%s'" % test_text)
    for ent in doc.ents:
        print(ent.label_, ent.text)
    
    # Save model 
    output_dir = Path('./model')
    if not output_dir.exists():
        output_dir.mkdir()
    nlp.meta['name'] = new_model_name  # rename model
    nlp.to_disk('./model')
    print("Saved model to", output_dir)

if __name__ == '__main__':
    plac.call(main)