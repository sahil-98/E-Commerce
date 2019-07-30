var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
const url = 'mongodb://localhost:27017/shopping';
const connect = mongoose.connect(url, { useNewUrlParser: true }); 

var userSchema = new  Schema ({
    email: {type : String, required: true},
    
    password: {type : String, required: true}

});

userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
};
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password,this.password);
};
console.log("Hello2222");
module.exports = mongoose.model('User',userSchema); 