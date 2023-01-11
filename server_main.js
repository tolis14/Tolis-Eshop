const RetriveCartProducts = require('./models/carts/retrive_cart');
const GetCartSize = require('./models/carts/get_cart_size');
const AddToCart = require('./models/carts/add_to_cart');
const Login = require('./models/users/login');

const express = require('express');
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'));

app.post('/users/:id/login',    (req, res) => Login.loginService(req,res));
app.post('/carts/:cartId',      (req,res) => AddToCart.addToCartService(req,res));
app.get('/carts/:cartId/size',  (req,res) => GetCartSize.getCartSizeService(req,res));
app.get('/carts/:cartId',       (req,res) => RetriveCartProducts.retriveCartService(req,res));


app.listen(port, () => console.log('Server started at http://localhost:' + port));