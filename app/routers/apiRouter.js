var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var uuid = require('uuid');
var User = require('../models/user');
var RequestedUser = require('../models/requestedUser')
var Session = require('../models/session');
var RequestNewPassword = require('../models/requestPass');
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
});

//create new user (Blogger)
router.post('/v1/signup',function(req,res){
    console.log('In');
    console.log(req.body.firstName);
    var requestedUser = new RequestedUser();
    User.find( {$or: [{'email':req.body.email},{'username':req.body.username}]},function(err,result){
        if(err){
            console.log(err);
            res.json({error: true, message : err});
        }else{
            console.log(result);
            if(result.length == 0){
                console.log('not found');
                requestedUser.id = uuid.v4();
                requestedUser.firstName = req.body.firstName;
                requestedUser.lastName = req.body.lastName;
                requestedUser.username = req.body.username;
                requestedUser.mobile = req.body.mobile;
                requestedUser.categories = req.body.categories
                requestedUser.facebookPage = req.body.facebook;
                requestedUser.instagram = req.body.instagram;
                requestedUser.youtubeChannel = req.body.youtube;
                requestedUser.twitter = req.body.twitter;
                requestedUser.email = req.body.email;
                requestedUser.password = requestedUser.generateHash(req.body.password);
                let mailOptions = {
                    from: 'kananek.ati@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: '[iReview360 system] Your account is already registered', // Subject line
                    html: 'Hi, <br> Your account is already added in our system and admin will verify your account and then we will get back to you' // html body
                };
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
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
                    console.log("Send the email already");
                });
            }else{
                res.json({error:false, message: "This email or username already exsiting in the system"});
            }
        }
    })
});
router.post('/v1/sendVerify',function(req,res){
    var link = req.protocol + '://' + req.get('host')+ "/api/v1/verify?id="+req.body.id;
    RequestedUser.findOne({id:req.body.id},function(err,result){
        if(err){
            console.log(err);
            res.json({error:true,message: err});
        }else{
            let mailOptions = {
                    from: 'kananek.ati@gmail.com', // sender address
                    to: result.email, // list of receivers
                    subject: '[iReview360 system] Verify successful', // Subject line
                    html: "Hi, <br> Your account is already verified by Admin, Please click this <a href='"+link+"'> link </a> to continue" // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }else{
                        console.log('Send verified email');
                        res.json({error:false,message: "Already send verified email to user"});
                    }
            });
        }
    })
})
//get verify by link www.ireview360.com/verify?id={{String}}
router.get('/v1/verify',function(req,res){
    var db = new User();
    var id;
    RequestedUser.findOne({'id':req.query.id},function(err,result){
        if(err){
            console.log(err);
            res.json({error:true,message: err});
            res.render("oops",{data:err});
        }else{
            if(result){
                db.firstName = result.firstName;
                db.lastName = result.lastName;
                db.username = result.username.toLowerCase();
                db.mobile = result.mobile;
                db.categories = result.categories;
                db.facebookPage = result.facebookPage;
                db.instagram = result.instagram;
                db.youtubeChannel = result.youtubeChannel;
                db.twitter = result.twitter;
                db.email = result.email.toLowerCase();
                db.password = result.password;
                db.save(function(err){
                    if(err){
                        console.log(err);
                    }else{
                        res.render("verifyPage",{data: result});
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
                //res.json({error: false,message: 'This account is not verify'});
                res.render("oops",{data : 'This account is not verify' });
            }
        }
    })
})
router.post('/v1/login',function(req,res){
    var session = new Session();
    User.findOne({'username':req.body.username},function(err,user){
        if(err){
            console.log(err);
            res.json({error:true,message:err});
        }else{
            if( user == null){
                res.cookie('success', false, { expires: new Date(new Date().getTime() + 60000) });
                console.log('Authentication failed; email or password is incorrect. Try again.');
                res.redirect('/login');
            }else{
                if (!user.validPassword(req.body.password)) {
                    res.cookie('success', false, { expires: new Date(new Date().getTime() + 60000) });
                    console.log('Authentication failed; email or password is incorrect. Try again.')
                    res.redirect('/login');

                }
                else {
                    var secret = uuid.v4();
                    session.secret = secret;
                    session.username = user.username;
                    session.save(function(err){
                        if(err){
                            res.end(err);
                        }else{
                            console.log("Login successfully");
                            res.cookie('secret', secret, { expires: new Date(new Date().getTime() + 1296000000) });
                            res.clearCookie("success");
                            res.redirect('/home');
                        }
                    })
            }
            }
        }
    })
});
router.get('/v1/logout', function (req, res) {
    Session.remove({ 'secret': req.cookies.secret }, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.clearCookie("success");
            res.clearCookie("secret");
            res.redirect('/login');
        }
    });
});

router.post("/v1/forgetPass", function (req, res) {
    //forgot password
    User.findOne({ 'email': req.body.email }, function (err, result) {
        if (err) {
            console.log(err);
            res.json({ success: false, message: err });
        } else {
            if (result) {
                var requestPass = new RequestNewPassword();
                var rand = uuid.v4();
                link = req.protocol + '://' + req.get('host')+"/api/requestNewPassword?id=" + rand;
                var mailOptions = {
                    from: "kananek.ati@gmail.com",
                    to: req.body.email,
                    subject: "[iReview360] Reset Password System",
                    html: "Hi, <br> Your username is "+result.username+" <br> Please click this <a href=" + link + "> link </a> to change your password"
                }
                requestPass.id = rand;
                requestPass.email = req.body.email;
                
                transporter.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        res.end(error);
                    } else {
                        requestPass.save(function (err) {
                            if (err) {
                                console.log(err);
                                res.end(err);
                            }
                            else {
                                console.log("Making a new request to request new password");
                                console.log('Wait...... for response from email');
                                res.json({ success: true, message: 'Please check your email address to continue.' })
                            }
                        });
                        console.log("Message sent: " + response.message);
                    }
                });
            } else {
                res.json({ success: false, message: "This email is not in the system" });
            }
        }
    })

});


router.get('/requestNewPassword', function (req, res) {
    RequestNewPassword.findOne({ 'id': req.query.id }, function (err, result) {
        if (err) {
            console.log(err);
        } else if (result != null) {
            if (result.id == req.query.id) {
                res.render('resetpassword', { 'email': result.email });
            } else { 
                res.render('already', { data: "You have successfully changed your password previously." })
            }
        } else {
            res.render('already', { data: "You have successfully changed your password previously." })
        }
    })

});

router.post('/updatePass',function(req,res){
    var db = new User();
    console.log(req.body.email);
    var password = db.generateHash(req.body.password); // encode password 
    User.findOne({ 'email': req.body.email }, function (err, result) {
        if (err) {
            console.log(err);
            res.end(err);
        } else {
            //update password and hash password tobe encode
            console.log(result);
            if (result == null) {
                //res.end("This email is not existed in the system");
                res.render('oop', { data: "This email is not existed in the system" });
            }
            else {
                result.update({
                    "password": password // update password
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                        res.end(err);
                    } else {
                        console.log('Update password successfully');
                        RequestNewPassword.remove({ 'email': req.body.email }, function (req, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('Remove request')
                            }
                        });
                        res.end('Changed');
                    }
                });
            }
        }
    })
    res.redirect('/');
    //res.render('changePass');
});

module.exports = router