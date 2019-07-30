 var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Order = require('../models/order')
var csrf = require('csurf');

var Product = require('../models/product');

 
//  GET home page.  
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err,docs) {
    var productChunks = [];
    var chunkSize = 3;
    //In this piece of code we splitting the docs into
    //two parts
    //One is having 3 documents
    //Other is having 2 documents VIDEO NO. 5 (7:00)
    for(var i=0 ;i<docs.length; i+= chunkSize) {
      productChunks.push(docs.slice(i,i+chunkSize));
    }
    res.render('shop/index', { title: 'Shopping Cart', products: productChunks,successMsg:successMsg,noMessages: !successMsg });
  });
  
});

router.get('/add', function(req,res,next) {
  res.render('user/work');
});

router.get('/add-to-cart/:id', function(req,res,next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId,function(err,product) {
      if(err) {
        return res.redirect('/');
      }
      cart.add(product,product.id);
      req.session.cart=cart; //session is save automatically
      console.log(req.session.cart);
      res.redirect('/');
    })
})

router.get('/reduce/:id', function(req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});
   console.log(productId);
  cart.reduceByOne(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
})

router.get('/remove/:id', function(req,res,next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});
   console.log(productId);
  cart.removeItem(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
})

router.get('/shopping-cart', function(req,res,next) {
  if(!req.session.cart) {
    console.log("Hello Bhai"); 
    return res.render('shop/shopping-cart', {products:null});
  }
  console.log("Yo YO")
  var cart = new Cart(req.session.cart);
  console.log(cart.generateArray());
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout',isLoggedIn, function(req,res,next) {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});



router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
      return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  
  var stripe = require("stripe")(
      "sk_test_JGc74hwTvEGJEekKXCn1X9yG009v5cBHOw"
  );

  stripe.customers.create({
    source: "tok_mastercard",
    email : req.user.email
  })

  stripe.charges.create({
      amount: cart.totalPrice*100,
      currency: "inr",
      source: "tok_mastercard", // obtained with Stripe.js
      description: "Test Charge",      
  }, function(err, charge) {
    if (err) {
        req.flash('error', err.message);
        return res.redirect('/checkout');
    }
    var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
        paymentId: charge.id
    });
    order.save(function(err, result) {
        req.flash('success', 'Successfully bought product!');
        req.session.cart = null;
        res.redirect('/');
    });
});  
});

/*router.post('/order',function(req,res,next){

  if(!req.session.cart) {
    return res.redirect('/checkout');
  }
  var cart = new Cart(req.session.cart);




});
*/
router.get('/checkout11', function(req,res,next) {
  if(!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  res.render('shop/checkout11');
  req.session.cart=null;
});



function isLoggedIn(req,res,next) {

    if(req.isAuthenticated()) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
function notLoggedIn(req,res,next) {

    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;

 




