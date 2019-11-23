/*                                            *\
** ------------------------------------------ **
**                 IOTA API                   **
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
var XRP = require('../lib/XRP.lib');

/* GET API List page. */
router.get('/', function(req, res, next) {
    res.render('apilist', { title: 'API - Command List' });
});

module.exports = router;