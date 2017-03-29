var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config/database.js');
var htmlRouter =require('./app/routers/htmlRouter');
var apiRouter = require('./app/routers/apiRouter');
var authHtmlRouter = require('./app/routers/authHtmlRouter');

var app = express();
var port = process.env.PORT || 3000;
//connect database 
mongoose.connect(config.url);
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
    //setting template for app
app.set('view engine', 'ejs');
app.use('/', htmlRouter,authHtmlRouter);
app.use('/api',apiRouter);

app.listen(port);
console.log('The magic happens in port '+ port);



