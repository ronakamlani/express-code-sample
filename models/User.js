// grab the things we need
var mongoose = require('mongoose');
//var bcrypt   = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
//var passportLocalMongoose=require('passport-local-mongoose');
// create a schema
var userSchema = new Schema({
	firstName: {
        type: String,        
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    dateOfBirth: {
        type: Date,
    },
    photo: {
        type: String,
    }   
    
 });

/*
userSchema.methods.generateHash = function(password) {  
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {  
  return bcrypt.compareSync(password, this.local.password);
};
userSchema.plugin(passportLocalMongoose,{
    usernameField:'email'
});

*/
// the schema is useless so far
// we need to create a model using it

// make this available to our users in our Node applications


//module.exports = userSchema;
module.exports = mongoose.model('users', userSchema);
