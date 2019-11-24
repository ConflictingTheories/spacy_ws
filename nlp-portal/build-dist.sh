#!/bin/bash

declare -x _MAIN_DIR=$(pwd)

declare -x _DIST_DIR="${_MAIN_DIR}/public"

declare -x _SRC_DIR="${_MAIN_DIR}/src"

# Requires UglifyJS and UglifyCSS

# JS Files
rm ${_DIST_DIR}/javascripts/nlpportal.min.js
cd ${_SRC_DIR}/js/nlp
for jsFile in $(ls ${_SRC_DIR}/js/nlp); do
    uglifyjs $jsFile >> ${_DIST_DIR}/javascripts/nlpportal.min.js
done
rm ${_DIST_DIR}/javascripts/3rd-party.min.js
cd ../lib
for jsFile in $(ls ${_SRC_DIR}/js/lib); do
    uglifyjs $jsFile >> ${_DIST_DIR}/javascripts/3rd-party.min.js
done


# CSS Files
rm ${_DIST_DIR}/stylesheets/nlpportal.min.css
cd ${_SRC_DIR}/css
for cssFile in $(ls ${_SRC_DIR}/css); do
    uglifycss $cssFile >> ${_DIST_DIR}/stylesheets/nlpportal.min.css
done
rm ${_DIST_DIR}/stylesheets/3rd-party.min.css
cd lib
for cssFile in $(ls ${_SRC_DIR}/css/lib); do
    uglifycss $cssFile >> ${_DIST_DIR}/stylesheets/3rd-party.min.css
done
