const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const JWT_SECRET = 'jdfjhdsuvnjdsfnckhd'

exports.userById = (req, res, next, id) => {
    console.log(id)
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "user not found",
            });
        }
        req.profile = user;
        next();
    });
};

exports.signup = (req, res) => {
    console.log(req.body);
    console.log(req.header);
    const user = new User(req.body);
    user.save((err, user) => {
        if (err){
            //console.log(err)
            return res.status(400).json({
                error: errorHandler(err) || err.message,
            });
        }
            
        user.salt = undefined;
        user.hashed_password = undefined;
       //generate a signed token with user id and secret
       const token = jwt.sign({ _id: user._id }, JWT_SECRET);

       //persist the token as 't' in cookie with expiry date
       res.cookie("t", token, { expire: new Date() + 9999 });

       // return response with user and token to frontend client
       const { _id, name, email} = user;
        return res.json({ token, user: { _id, email, name} });
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "email does not exist. Please signup",
            });
        }
        //if user is found, make sure the email and password match
        //create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: "Email and password does not match",
            });
        }

        //generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
    
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, email, name } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    res.json({ message: "signed out successfully" });
};

exports.requireSignin = expressJwt({
    secret: JWT_SECRET,
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "Access Denied",
        });
    }
    next();
};

