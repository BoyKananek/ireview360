var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var uuid = require('uuid');
var RequestedUser = require('../models/requestedUser')


router.get('/',function(req,res){
    console.log('get request');
    res.end('Comming soon!!!!');
})
router.get('/signup',function(req,res){
    res.render('signup');
})
router.get('/login',function(req,res){
    res.render('login');
})
router.get('/admin',function(req,res){
    RequestedUser.find({},function(err,users){
        if(err){
            console.log(err);
            res.json({error:true,message: err});
        }else{
            console.log(users);
            res.render('admin',{users:users});
        }
    })
})
router.get('/forgotPassword',function(req,res){
    res.render('requestpass');
})
module.exports = router;