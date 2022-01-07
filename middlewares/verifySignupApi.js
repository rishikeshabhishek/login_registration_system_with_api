const UserModel = require("../models/User");

exports.checkDuplicateEntries = (req, res, next) => {
    UserModel.findOne({
        userName: req.body.username
    }).exec((err, user) => {
        if (err) {
            console.log(err);
            return;
        }
        if (user) {
            return res.status(404).json({
                result: user,
                message: "Username Already Exist..."
            })
        }
        UserModel.findOne({
            email: req.body.email
        }).exec((err, email) => {
            if (err) {
                console.log(err);
                return;
            }
            if (email) {
                return res.status(404).json({
                    result: email,
                    message: "Email Already Exists"
                });
                // console.log("Email already exist...");
                // return;
            }
            // next();
            const password = req.body.password;
            const confirm = req.body.confirmpassword;
            if (password !== confirm) {
                return res.status(404).json({
                    message: "Password & Confirm Password Are Not Matched"
                });
            }
            next();
        })
    })
}