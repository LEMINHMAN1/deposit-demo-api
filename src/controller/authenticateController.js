const passport = require('passport');
const winston = require('winston');
const md5 = require('md5');
const { ObjectID } = require('mongodb');
const { isEmpty } = require('lodash');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token')
const daos = require('./../model/daos');
const collection = require('./../constant/collection');

var refreshTokens = {};

exports.login = async (req, res) => {
  const {email, password} = req.body;

  // Get user info
  const userCollection = daos.collection(collection.USER);
  let user = await userCollection.find({ email });

  // Error handler
  if (!isEmpty(user.err)) return res.status(400).send('Bad request');
  if (isEmpty(user.data)) {
    winston.info(`User '${email} not found.`);
    return res.status(400).send(`Email '${email}' not found.`);
  }

  // Build token, refresh token
  const data = user.data[0];
  if (data.password !== md5(password)) {
    winston.info(`Incorrect password.`);
    return res.status(400).send('Incorrect password.');
  }
  delete data.password;
  // delete data._id;
  var accessToken = jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1d' })
  var refreshToken = randtoken.uid(256);

  // Save refresh token
  refreshTokens[refreshToken] = data.email;
  return res.json({user: user?.data[0], accessToken, refreshToken })
}

exports.register = async (req, res) => {
  const {email, password} = req.body;
  const userCollection = daos.collection(collection.USER);

  const found = await userCollection.find({ email });
  if(!isEmpty(found?.data)){
    return res.status(400).send("Email existed");
  }

  const completed = await userCollection.insert({email, password: md5(password), timestamp: new Date()});
  return res.status(200).send(completed);
}

exports.newToken = async (req, res, next) => {
  const {email, refreshToken} = req.body
  try{
    // Get user info
    const userCollection = daos.collection(collection.USER);
    let user = await userCollection.find({ email });

    // Generete new token
    const data = user.data[0];
    delete data.password;
    var accessToken = jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: '1d' })
    return res.json({ accessToken });
  }catch(err){
    res.sendStatus(401)
  }
}

// Setup JWT options
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.TOKEN_SECRET;

passport.use('authenticate', new JwtStrategy(opts, (jwtPayload, done) => {

  // If the token has expiration, raise unauthorized
  var expirationDate = new Date(jwtPayload.exp * 1000);
  if (expirationDate < new Date()) {
    return done(null, false);
  }
  var user = jwtPayload;
  done(null, user)
}))
