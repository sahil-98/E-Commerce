var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const url = 'mongodb://localhost:27017/shopping';
const connect = mongoose.connect(url, { useNewUrlParser: true }); 

var Schema = new  Schema ({
    imagePath: {type : String, required: true},
    
    title: {type : String, required: true},
    
    description: {type : String, required: true},
    
    price: {type : Number, required: true}

});
console.log("Hello2222");
module.exports = mongoose.model('Product',Schema); 