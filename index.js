var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var config = require('./config/database.js');
var htmlRouter =require('./app/routers/htmlRouter');

var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
    //setting template for app
app.set('view engine', 'ejs');

app.use('/',htmlRouter);

app.listen(port);
console.log('Magic happen in port '+ port);



