var Product = require('../models/product');

var mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/shopping';
const connect = mongoose.connect(url, { useNewUrlParser: true }); 

var product = [
 new Product ({
    imagePath:'3max.jpg',
    title: 'Call of Duty', 
    description: "Call of Duty is a first-person shooter video game franchise published by Activision",
    price: 499


}),
new Product ({
    imagePath:'4.jpg',
    title: 'Fortnite',
    description: "Fortnite is the completely free multiplayer game where you , jump into Battle Royale ",
    price: 699


}),
new Product ({
    imagePath:'6.jpg',
    title: 'FIFA 19',
    description: "FIFA 19 is a football simulation video game developed by EA Vancouver as ea' FIFA series",
    price: 699


}),
new Product ({
    imagePath:'3.jpg',
    title: 'Watch Dogs 2',
    description: "Watch Dogs is an action-adventure video game developed by Ubisoft Montreal and by Ubisoft.",
    price: 499


}),
new Product ({
    imagePath:'5.jpg',
    title: 'Forza',
    description: "Forza is a series of semi-sim racing video games for Xbox and Microsoft published by Xbox",
    price: 399


}),
new Product ({
    imagePath:'8.png',
    title: 'Hitman',
    description: "Hitman is a stealth video game developed by IO Interactive. Game published by Square Enix",
    price: 499


}),

];

var done=0;
console.log(product.length);
for(var i=0 ; i<product.length;i++)
{
    product[i].save(function(err,result){

        done++;
        if(done===product.length) {
            exit();
        }
    });

}
function exit()  {
mongoose.disconnect();
}