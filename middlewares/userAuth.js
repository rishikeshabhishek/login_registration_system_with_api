const jwt = require("jsonwebtoken");
exports.authJwt = (req, res, next) => {
    if (req.cookies && req.cookies.token) {
        jwt.verify(req.cookies.token, "abhishek-23051998@#1!4959", (err, data) => {
            req.user = data
            next()
        })
    } else {
        next()
    }
}