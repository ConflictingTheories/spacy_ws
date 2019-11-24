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
var fs = require('fs');
var express = require('express');
var router = express.Router();
var request = require('request-promise');

/* GET API List page. */
router.get('/', function(req, res, next) {
    res.render('apilist', { title: 'API - Command List' });
});

router.post('/train/redact', (req,res,next)=>{
    console.log(req.body);
    
    // Save file into Training Folder
    fs.writeFile(`${__dirname}/../../training/redact_data/${Date.now()}.data.json`,JSON.stringify(req.body),(err)=>{
        if(err){
            console.error(err);
            res.json({
                err:err
            });
        }
        res.json({
            msg:"success"
        });
    });

    // Then Queue up more training

})

router.post('/train/report', (req,res,next)=>{
    console.log(req.body);
    // Save file into Training Folder
    fs.writeFile(`${__dirname}/../../training/report_data/${Date.now()}.data.json`,JSON.stringify(req.body),(err)=>{
        if(err){
            console.error(err);
            res.json({
                err:err
            });
        }
        res.json({
            msg:"success"
        });
    });

    // Then Queue up more training)

});

router.get('/retrain/:name', (req,res,next)=>{
    console.log(req.params);
    let name = req.params.name;
    request(`http://localhost:8080/${name}`)
    .then(()=>res.json({msg:"sucess"}))
})

router.get('/reload/:name', (req,res,next)=>{
    console.log(req.params);
    let name = req.params.name;
    request(`http://localhost:8080/reload/${name}`)
    .then(()=>res.json({msg:"sucess"}))
});

module.exports = router;