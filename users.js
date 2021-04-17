const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")
const keys = {
    mongoUrl:'mongodb+srv://admin:O91qZr3jMRcG4V82@cluster0.9bjhc.mongodb.net/dbMessage?retryWrites=true&w=majority',
    secretOrKey: "secret"
}
// Load input validation
const validateRegisterInput = require("./register");
const validateLoginInput = require("./login");
// Load User model
const User = require("./User");


// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  User.findOne({$or: [ { username: req.body.username },{ email: req.body.email },{ phno: req.body.phno }]}).then(user => {
      if (user) {
        return res.status(400).json({ username: "Username already exists or",email: "Email already exists or", phno: "Phone number already exists" });
      } 
      else 
      
      {
        const newUser = new User({
          username: req.body.username,
          name: req.body.name,
          email: req.body.email,
          phno: req.body.phno,
          password: req.body.password
        });
  // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })  ;
  });   




  // @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
  const username = req.body.username;
    const password = req.body.password;
  // Find user by email
    User.findOne({ username }).then(user => {
      // Check if user exists
      if (!user) {
        return res.status(404).json({ usernamenotfound: "Username not found" });
      }
  // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User matched 
          // Create JWT Payload
          const payload = {
            id: user.id,
            username: user.username
          };
  // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
          

        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

module.exports = router;