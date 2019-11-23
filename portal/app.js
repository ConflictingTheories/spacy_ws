/*                                            *\
** ------------------------------------------ **
**                 IOTA API                   **
** ------------------------------------------ **
**          Copyright (c) 2019                **
**              - Kyle Derby MacInnis         **
**                                            **
** Any unauthorized distribution or transfer  **
**    of this work is strictly prohibited.    **
**                                            **
**           All Rights Reserved.             **
** ------------------------------------------ **
\*                                            */

// ----- LIBRARIES
//
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

// ---- ROUTES
//
var index = require('./routes/index');
var api = require('./routes/api');

// ---- APP SERVER
//
var app = express();

// ---- CONFIGURATION
//
// view engine setup (EJS --- .html)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
// Favicon (Needs one)
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// Logging
app.use(logger('dev'));
// Parsing (JSON)
app.use(bodyParser.json());
// Parsing (URL Encoding)
app.use(bodyParser.urlencoded({ extended: false }));
// Cookies
app.use(cookieParser());
// Public Directory
app.use(express.static(path.join(__dirname, 'public')));
// Compression
// app.use(compression);

// ---- API ROUTES
//
// Index API Calls
app.use('/', index);
// XRP Server Calls
app.use('/api', api);

// ---- ERROR HANDLING
//
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: "Error" });
});

// Export
module.exports = app;