var express = require('express');
var router = express.Router();
var Session = require('../models/session');
var User = require('../models/user');
var uuid = require('uuid');

 
var auth = function(req,res,next){
    console.log('Cookie id :' + req.cookies.secret );
    Session.findOne({'secret':req.cookies.secret },function(err,result){
        if(err){
            console.log(err);
            res.sendStatus(401);
        }else{
            console.log(result);
            if(result){
                return next();
            }else{
                return res.redirect('/login');
            }
        }
    })
};

router.get('/home',auth,function(req,res){
    Session.findOne({'secret':req.cookies.secret},function(err,result){
        if(err){
            console.log(err);
        }else{
            //res.end("Logined as :"+ result.username);
            res.render("dashboard",{data:result}); 
        }
    })
})

module.exports = router