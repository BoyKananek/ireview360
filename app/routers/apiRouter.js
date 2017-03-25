var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var uuid = require('uuid');
var User = require('../modules/user');
var RequestedUser = require('../modules/requestedUser')

//create new user (Blogger)
router.post('/v1/signup',function(req,res){
    var requestedUser = new RequestedUser();
    User.find( {$or: [{'email':req.body.email},{'username':req.body.username}]},function(err,result){
        if(err){
            console.log(err);
            res.json({error: true, message : err});
        }else{
            if(!result){
                requestedUser.id = uuid.v4();
                requestedUser.firstName = req.body.firstName;
                requestedUser.lastName = req.body.lastName;
                requestedUser.username = req.body.username;
                requesteduser.mobile = req.body.mobile;
                requestedUser.categories = req.body.categories
                requestedUser.facebookPage = req.body.facebook;
                requestedUser.instagram = req.body.instagram;
                requestedUser.youtubeChannel = req.body.youtube;
                requestedUser.twitter = req.body.twitter;
                requestedUser.email = req.body.email;
                requestedUser.password = requestedUser.generateHash(req.body.password);
                requestedUser.save(function (err){
                    if(err){
                        console.log(err);
                        res.json({error:true,message:err});
                    }else{
                        console.log('Save in requested user');
                        console.log("Request complete!!");
                        res.json({error:false,message: 'Request successful!'});
                    }
                })
            }else{
                res.json({error:false, message: "This email or username already exsiting in the system"});
            }
        }
    })
});

//get verify by link www.ireview360.com/verify?id={{String}}
router.get('/verify',function(req,res){
    var db = new User();
    var id;
    RequestedUser.findOne({'id':req.query.id},function(err,result){
        if(err){
            console.log(err);
            res.json({error:true,message: err});
        }else{
            if(!result){
                db.firstName = result.firstName;
                db.lastName = result.lastName;
                db.username = result.username;
                db.mobile = result.mobile;
                db.categories = result.categories;
                db.facebookPage = result.facebookPage;
                db.instagram = result.instagram;
                db.youtubeChannel = result.youtubeChannel;
                db.twitter = result.twitter;
                db.email = result.email;
                db.password = result.password;
                db.save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Save successful");
                        RequestedUser.remove({'email':result.email},function(err,result2){
                            if(err){
                                console.log(err);
                            }else{
                                console.log('Remove requested account');
                            }
                        })
                    }
                })
            }else{
                console.log("This account is not verify");
                res.json({error: false,message: 'This account is not verify'});
            }
        }
    })
})

module.exports = router