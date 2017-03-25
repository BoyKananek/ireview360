var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var uuid = require('uuid');
var User = require('../modules/user');

//create new user (Blogger)
router.post('/api/v1/signup',function(req,res){
    
})

module.exports = router