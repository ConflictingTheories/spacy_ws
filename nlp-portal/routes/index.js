/*                                            *\
** ------------------------------------------ **
**                  NLP API                   **
** ------------------------------------------ **
**          Copyright (c) 2019           **
**              - Kyle Derby MacInnis         **
**                                            **
** Any unauthorized distribution or transfer  **
**    of this work is strictly prohibited.    **
**                                            **
**           All Rights Reserved.             **
** ------------------------------------------ **
\*                                            */

/* ------------------------------ *\
//       INDEX API ROUTER         \\
\* ------------------------------ */

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'NLP Portal - Training Platform',
        preloaded: false,
        type: false,
        details: {}
    });
});

// Wallet Generator
router.get('/train', function(req, res, next) {
    res.render('index', {
        title: 'NLP Portal - Training Platform',
        preloaded: true,
        type: 'train',
        details: {}
    });
});

// Account Viewer
router.get('/test', function(req, res, next) {
    res.render('index', {
        title: 'NLP Portal - Testing Platform',
        preloaded: true,
        type: 'test',
        details: {}
    });
});

module.exports = router;