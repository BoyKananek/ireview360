var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var uuid = require('uuid');


router.get('/',function(req,res){
    console.log('get request');
    res.end('Comming soon!!!!');
})
router.get('/login',function(req,res){
    res.render('login');
})

module.exports = router;