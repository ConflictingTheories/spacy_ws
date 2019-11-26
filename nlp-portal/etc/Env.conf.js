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
//        ENVIRONMENT CONF        \\
\* ------------------------------ */

const process = require('process');

module.exports = {
    AWS_APIKEY: "",
    GOOGLE_APIKEY: "",
    STRIPE_APIKEY: "",
    SENDGRID_APIKEY: "",
    
    NLP_HOST: process.env['NLP_HOST'] || "localhost",
    NLP_PORT: process.env['INT_NLP_PORT'] || 8080,
    NLP_PROTOCOL: process.env['NLP_PROTOCOL'] || "http://",

    WS_HOST: process.env['WS_HOST'] || "localhost",
    WS_PROTOCOL: process.env['WS_PROTOCOL'] || "ws://",
    WS_PORT: process.env['WS_PORT'] || 8765
};