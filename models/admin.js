var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({
	email: {
        type: String,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    }    
});
userSchema.methods.generateHash = function(password) {
    console.log("fDFSsfsd")
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

/*userSchema.pre('save', function(next) {
    var user = this;
    console.log("Inside pre");
    user.password=createHash(password)
});
var createHash = function(password){
    console.log("Inside create");
 return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}*/
//module.exports = userSchema;
module.exports = mongoose.model('admin', userSchema);
