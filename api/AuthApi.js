const UserModel = require("../models/User");
const TokenModel = require("../models/Token");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");



exports.signup = (req, res) => {
    UserModel({
        userName: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).save((err, user) => {
        if (!err) {
            // generate token
            TokenModel({
                _userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }).save((err, token) => {
                if (!err) {
                    var transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: "my.dev1998@gmail.com",
                            pass: "My.Dev1998#@!"
                        }
                    });
                    var mailOptions = {
                        from: 'no-reply@abhishek.com',
                        to: user.email,
                        subject: 'Account Verification',
                        text: 'Hello ' + req.body.username + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n'
                    };
                    transporter.sendMail(mailOptions, function(err) {
                        if (err) {
                            res.status(404).json({
                                result: err,
                                message: "Technical Issue"
                            });
                        } else {
                            res.status(200).json({
                                status: 'success',
                                result: user,
                                message: "Mail Sent... Please Verify..."
                            });
                        }
                    });
                } else {
                    res.status(404).json({
                        result: err,
                        message: "Error When Create Token..."
                    });
                }
            })

        } else {
            res.status(404).json({
                result: err,
                message: "Error When Create User..."
            });

        }
    })
}

exports.confirmation = (req, res) => {
    TokenModel.findOne({ token: req.params.token }, (err, token) => {
        if (!token) {
            console.log("Verification Link May Be Expired :(");
        } else {
            UserModel.findOne({ _id: token._userId, email: req.params.email }, (err, user) => {
                if (!user) {
                    res.status(404).json({
                        result: err,
                        message: "User Not Found..."
                    });
                } else if (user.isVerified) {
                    res.status(404).json({
                        result: err,
                        message: "User Already Verified..."
                    });
                } else {
                    user.isVerified = true;
                    user.save().then(result => {
                        res.status(200).json({
                            status: 'success',
                            result: user,
                            message: "Your Account Successfully Verified"
                        });
                    }).catch(err => {
                        res.status(404).json({
                            result: err,
                            message: "Something Went Wrong"
                        });
                    })
                }
            })
        }
    })
}

exports.signin = (req, res, next) => {
    UserModel.findOne({
        email: req.body.email
    }, (err, data) => {
        if (data) {
            if (data.isVerified) {
                const hashPassword = data.password;
                if (bcrypt.compareSync(req.body.password, hashPassword)) {
                    const token = jwt.sign({
                        id: data._id,
                        username: data.userName
                    }, "abhishek-23051998@#1!4959", { expiresIn: '1m' });
                    res.cookie("token", token);
                    if (req.body.rememberme) {
                        res.cookie('email', req.body.email)
                        res.cookie('password', req.body.password)
                    }
                    res.status(200).json({
                        status: 'success',
                        result: data,
                        message: "Login...."
                    });

                } else {
                    res.status(404).json({
                        result: err,
                        message: "Invalid Password"
                    });
                }
            } else {
                res.status(404).json({
                    result: err,
                    message: "Account Is Not Verified"
                });

            }
        } else {
            res.status(404).json({
                result: err,
                message: "Invalid Email"
            });
        }
    })
}