const express = require('express');
const passport = require('passport');
const authController = require('./../controller/authenticateController');
const bidController = require('./../controller/bidController');
const userController = require('./../controller/userController');

var app = module.exports = express.Router();

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (user, done) => {
    done(null, user)
});

const auth = ()=>{
    return passport.authenticate('authenticate')
}

// Test
app.get('/ping', authController.ping);

// Authenticate
app.post('/login', authController.login);
app.post('/register', authController.register);
app.post('/token', authController.newToken);

// Bid
app.post('/bid/create', auth(), bidController.create);
app.get('/bid/get', auth(), bidController.get);
app.patch('/bid/place-order', auth(), bidController.bid);

// User
app.patch('/user/deposit', auth(), userController.deposit);
app.get('/user/get', auth(), userController.get);