const express = require('express');
const router = express.Router();

const User = require('../models/user').User;

//Tokens
//const jwt = require('jsonwebtoken');
//const jwtOptions = require('../config/jwtOptions');
//password
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ message: "Provide username and password" });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'user already exist' });
      return;
    }

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username,
      password: hashPass
    });
    newUser.save((err, user) => {
      if (err) {
        res.status(400).json({ message: 'cant save' });
      } else {

        let payload = {id: user._id, user: user.username};
      //  let token = jwt.sign(payload, jwtOptions.secretOrKey);

        res.status(200).json({message: "ok",/*token: token,*/ user: user});
      }
    });
  });
});

router.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // if(req.body.username && req.body.password){
  //   const username = req.body.username;
  //   const password = req.body.password;
  // }

  if (username === "" || password === "") {
    res.status(401).json({message:"fill up the fields"});
    return;
  }

  User.findOne({ "username": username }, (err, user)=> {

  	if( ! user ){
	    res.status(401).json({message:"Invalid user"});
	  } else {
      bcrypt.compare(password, user.password, function(err, isMatch) {
        console.log(isMatch);
        if (!isMatch) {
          res.status(401).json({message:"Invalid password"});
        } else {
        	console.log('user', user);
          let payload = {id: user._id, user: user.username};
        //  let token = jwt.sign(payload, jwtOptions.secretOrKey);
          console.log(token);
          res.json({message: "ok",/* token: token,*/ user: user});
        }
      });
    }
  });
});

module.exports = router;
