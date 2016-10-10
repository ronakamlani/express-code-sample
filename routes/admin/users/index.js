var express = require('express');
var bodyParser = require('body-parser');
var multer  = require('multer');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var fs = require('fs');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  './public/admin/images/users')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()  + path.extname(file.originalname))
  }
})
var upload = multer({ storage: storage })
var router = express.Router();

var mongoose = require('mongoose');

var async = require('async');

var User = require('../../../models/User');
var error = require("../../../helper/error.js");
function ensureAuthenticated(req, res, next) {
  console.log("fgdfgdfg",req.session.authenticated)
  if (req.isAuthenticated())
    return next();
  else
    res.render('admin/auth/form');
}
//var author = require("../../../helper/auth.js");
// if our user.js file is at app/models/user.js

router.use(bodyParser.urlencoded({ extended: false })); 



/* GET users listing. */
router.get('/',ensureAuthenticated, function(req, res, next) {
//  var User = req.db.model('User', userSchema);
	
	/*sear="{$or:[";
	for (var propName in req.query) {
    	if (req.query.hasOwnProperty(propName)&&req.query[propName]!="") {
    		sear=sear + "{" + propName + ":new RegExp('^" + req.query[propName] + "','i')},";
    	}
    }
    sear=sear.substr(0,sear.length-1) + "]}";
    console.log('writinnnnnng  ',sear)
    if(req.query['ord'] && (req.query['ord']=="a")){
		console.log('inside ascending');
		User.find(sear,null,{skip:0,limit:10,sort:{name : 1}}, function(err, users) {
 		res.render('admin/users/',{users:users});
  	});	
	}
	else if(req.query['ord'] && (req.query['ord']=="d")){
		console.log('inside descending');
		User.find(sear,null,{skip:0,limit:10,sort:{name : -1}}, function(err, users) {
 		res.render('admin/users/',{users:users});
  	});	
	}
	else {
		console.log('inside normal');
		User.find( sear, function(err, users) {
 		res.render('admin/users/',{users:users});
  	});	
	}*/
  console.log(req.user)
	for (var key in req.query['search']) {
		if( req.query['search'][key] ==''  )
		{	
			delete req.query['search'][key];
		}

	}
	var firstName=null,lastName=null,email=null,gender=null;
	if(req.query['search']){
		if(req.query['search'].firstName)
			firstName=req.query['search'].firstName;
		if(req.query['search'].lastName)
			lastName=req.query['search'].lastName;
		if(req.query['search'].email)
			email=req.query['search'].email;
		if(req.query['search'].gender)
			gender=req.query['search'].gender;
	}
	if(!req.query['page']){
		page=1;
	}	
	else{
		page=req.query['page'];
	}

	var records=(page-1)*10;
  
  async.parallel({
    totalRecords:function(callback) {
        User.count(req.query['search'], function(err, count) {
          callback(err,count);
      });
    },
    users:function(callback) {
        var query=User.find(req.query['search']).skip(records).limit(10);
        query.exec(function(err, users) {
          callback(err, users);
        });
    }
  },
  // optional callback
  function(err, results) {
      // the results array will equal ['one','two'] even though
      // the second function had a shorter timeout.
      if( err )
      {
        error.errorHandler(res,err);
      }
      else
      {
        console.log(results);
        res.render('admin/users/', {users:results['users'],count:results['totalRecords'],messages: req.flash('info'),firstName : firstName,lastName : lastName,email : email,gender : gender});
      }
  });

	/*User.count(req.query['search'], function(err, count) {
		var query=User.find(req.query['search']).skip(records).limit(10);
		query.exec(function(err, users) {
	   		 	res.render('admin/users/', {users:users,count:count,messages: req.flash('info'),firstName : firstName,lastName : lastName,email : email,gender : gender});
  		});
	});	*/			
});


//Create User
router.get('/create',ensureAuthenticated, function(req, res, next) {
	res.render('admin/users/form'); 
 });


router.post('/save',ensureAuthenticated , function(req, res, next) {
	upload.single('photo')(req, res, function (err) {
    	if (err) {
      		console.log(err.message);
     		return
    	}
    	console.log("Password  ",req.body.password)
  //  	var User= req.db.model('User', userSchema);	
		User.find({email : req.body.email}, function (err, docs) {
		if (!docs.length){    			
        var new_user = new User({

				firstName : req.body.firstName,
				lastName : req.body.lastName,
				email : req.body.email,
				password : req.body.password,
				gender : req.body.gender,
				dateOfBirth : req.body.dateOfBirth,
				photo : req.file.filename
    		});
    		var error = new_user.validateSync();
    		console.log("errrrrrooorrrrr    ",error)
    	    new_user.save(function (err, data) {
	    		if (err) console.log(err);
   				else console.log('Saved : ', data );
			});	
			res.contentType('json');
        	res.status(200).send({ message : 'Record inserted!!',status:200 });
        }
        else{        	
        	fs.unlink('./public/admin/images/shops/' + req.file.filename,function(err){
        		if(err) error.errorHandler(res,err);
      	  		console.log('file deleted successfully');
 			});  
        	res.contentType('json');
        	res.status(200).send({ message : 'Email Already Exists!!',status:500 });
        }
    	});
    });
});


//update user
router.get('/edit/:userid',ensureAuthenticated, function(req, res, next) {

	//var User = req.db.model('User', userSchema);
	var id= req.params.userid;

	User.findById({_id:id}, function (err, doc) {
	  	if(err)
  		  error.errorHandler(res,{message : "Invalid ID!!"});
	  	else	
	  		res.render('admin/users/edit_form',{user1:doc});
  });	
});


router.get('/delete/:userid',ensureAuthenticated, function(req, res, next) {
	//var User = req.db.model('User', userSchema);
	var id= req.params.userid;
	var query=User.findById({_id : id});
	query.select('photo');
	query.exec(function (err, docs){
		if(err){
	  	error.errorHandler(res,{message : "Invalid ID!!"});
	  }
		im=docs.photo;
		fs.unlink('./public/admin/images/users/' + im,function(err){
       		if(err) error.errorHandler(res,err);
    			console.log('file deleted successfully');
 		});
		User.remove({_id:id}, function(err){
			if(err)
	  		error.errorHandler(res,{message : "Invalid ID!!"});
		});
		req.flash('info', 'Successfully deleted!!');
		res.redirect('/admin/users');	
	});	
	
});


router.get('/delete',ensureAuthenticated, function(req, res, next) {
	var emails = req.query.emails;
	var im;
//	var User = req.db.model('User', userSchema);
	var query=User.find({_id : { $in: emails }});
	query.select('photo');
	query.exec(function (err, docs){
		if(err)
	  	error.errorHandler(res,{message : "Invalid ID!!"});
		for(i=0;i<docs.length;i++){
			im=docs[i].photo;
			console.log("delete   ",im)	
			fs.unlink('./public/admin/images/users/' + im,function(err){
        		if(err) error.errorHandler(res,err);
      			console.log('file deleted successfully');
 			}); 			
 		}	
 		User.remove({_id: { $in: emails } }, function (err) {
 			if(err)
	  		error.errorHandler(res,{message : "Invalid ID!!"});
 		});  
 		req.flash('info', 'Successfully deleted!!');		
		res.redirect('/admin/users');
	});  	    
});	


router.post('/update',ensureAuthenticated, function(req, res, next) {
  var new_photo;
  upload.single('photo')(req, res, function (err) {
    	if (err) {
      		console.log(err.message);
     		return
    	}	
  		var id= req.body.hidden_id;
  		var im= req.body.hidden_image;
  		if(req.file){
  			new_photo=req.file.filename;
  			fs.unlink('./public/admin/images/users/' + im,function(err){
        		if(err) error.errorHandler(res,err);
      				console.log('file deleted successfully');
 			});
  		}
  		else{
  			new_photo=im;
  		}
  	//	var User = req.db.model('User', userSchema);
  		User.findOne({_id:id}, function (err, book) {
  		console.log("old email   ",book.email);
  		console.log("new email   ",req.body.email);
  		if(book.email==req.body.email){
  			book.firstName=req.body.firstName;
  			book.lastName=req.body.lastName;
  			book.email=req.body.email;
  			book.gender=req.body.gender;
  			book.dateOfBirth=req.body.dateOfBirth;
  			book.photo=new_photo;
  			book.save();
  			res.contentType('json');
        	res.status(200).send({ message : 'Record updated!!',status:200 });
  		}
  		else{
  			User.find({email : req.body.email}, function (err, docs) {  			
  			if (!docs.length){        	
  				book.firstName=req.body.firstName;
  				book.lastName=req.body.lastName;
  				book.email=req.body.email;
  				book.gender=req.body.gender;
  				book.dateOfBirth=req.body.dateOfBirth;
  				book.photo=new_photo;
  				var error = badBreakfast.validateSync();
  				book.save();
  				res.contentType('json');
        		res.status(200).send({ message : 'Record updated!!',status:200 });
        	}
        	else{
        		if(req.file){
        		fs.unlink('./public/admin/images/users/' + req.file.filename,function(err){
        			if(err) error.errorHandler(res,err);
      	  				console.log('file deleted successfully');
 				});  
        		}
	        	res.contentType('json');
    	    	res.status(200).send({ message : 'Email Already Exists!!',status:500 });
        	}
        	});
        }	
	  
  		});  
	});
});  

module.exports = router;

