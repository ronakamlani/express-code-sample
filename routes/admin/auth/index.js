  var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');

 
var router = express.Router();

var mongoose = require('mongoose');

var Admin = require('../../../models/admin');
//var error = require("../../../helper/error.js");
var util = require('util');
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.render('admin/auth/form');
}
router.use(session({
        secret: 'codetutorialsecret',
        resave:true,
        saveUninitialized:true
    }));
router.use(passport.initialize());
 
router.use(passport.session());
 
passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    console.log("username     ",username);
    Admin.findOne({
      'email': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        console.log("Not found")
        return done(null, false);
      }
      console.log(user.password)
      console.log(password)
      console.log(bcrypt.hashSync("123", bcrypt.genSaltSync(8), null))
      if (!bcrypt.compareSync(password, user.password)) {
        console.log("Password does not match")
        return done(null, false);
      }
      console.log("Inside authenticate",user)
      return done(null, user);
    });
  });
}));

 passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, user) {
            done(err, user);
        });
    });


router.get('/',ensureAuthenticated, function(req, res, next) {
    res.render('admin/auth/index',{ user : req.user });
});

router.get('/login', function(req, res) {
  console.log("Form  ")
    res.render('admin/auth/form');
});
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/admin/auth/login/'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/admin/auth');
    });
  })(req, res, next);
});


router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/auth/',
    failureRedirect: '/admin/auth/login/',
    failureFlash : true
  })
);

/*router.get('/save',function(req, res, next) {
  console.log("In")
  var testdata = new Admin();
  testdata.email = "admin@gmail.com",
  testdata.password= testdata.generateHash("123");    
  console.log(testdata.password)
  testdata.save(function(err, data){
    if(err) console.log(error);
    else {
      console.log ('Success:' , data);
      res.send("Done");
    }  
});

});*/
router.get('/logout',ensureAuthenticated, function(req, res) {
    req.logout();
    res.redirect('/admin/auth/login');
});



module.exports = router;