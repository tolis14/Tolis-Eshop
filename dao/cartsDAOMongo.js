require('dotenv').config({path: './.env'});
const cartsDAO = require("./cartsDAO");

const  MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_ESHOP_URI;

class CartsDAOMongo extends cartsDAO{

    constructor(){
        super();
        this.client = new MongoClient(uri);
    }

    async findUsersCart(userName){

        try{
            console.log('Connecting to the db.eshop.carts');
            await this.client.connect();
            const db            = this.client.db('eshop');
            const collection    = db.collection('carts');

            console.log('Finding',userName,'all products');

            const query = {name:userName};
            const options = {projection:{product: 1}};

            const cursor = collection.find(query,options);

            let cart = [];

            await cursor.forEach((product) => cart.push(product));
            return cart;
        }
        finally{
            console.log('Disconnecting from db.eshop.carts');
            await this.client.close();
        }
    }

    async getCartSize(userName){

        try{
            console.log('Connecting to the db.eshop.carts');


            await this.client.connect();
            const db            = this.client.db('eshop');
            const collection    = db.collection('carts');
            
            console.log('Finding all the products in',userName,"'s cart");

            const query = {name: userName};
            const cursor = collection.find(query);

            let counter = 0;
            
            await cursor.forEach(document => {
                counter = counter + document.product.quantity;
            });

            return counter;
        }
        finally{
            await this.client.close();
            console.log('Disconnecting to the db.eshop.carts');
        }
    }

    async addToCart(userName,product){

        try{
            console.log('Connecting to the db.eshop.carts');

            await this.client.connect();
            const db            = this.client.db('eshop');
            const collection    = db.collection('carts');
            
            console.log('Update',userName,"'s cart");
            
            const query = {name: userName,'product.id': product.id};
            const result = await collection.findOne(query);
            
            if(result){

                let new_quantity = result.product.quantity + 1;                
                const options = {upsert: false};
                const updatedDoc = {
                    $set:{
                        'product.quantity': new_quantity
                    }
                };
                await collection.updateOne(query,updatedDoc,options);
            }
            else{
           
                const document = {
                    name: userName,
                    product: {
                        id: product.id,
                        title: product.title,
                        cost: product.cost,
                        quantity: 1
                    }
                };
                await collection.insertOne(document);
            }
        }
        finally{
            await this.client.close();
            console.log('Disconnecting to the db.eshop.carts');
        }
    }
}

module.exports = CartsDAOMongo;