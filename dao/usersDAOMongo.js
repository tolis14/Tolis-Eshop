require('dotenv').config({path: './.env'});
const usersDAO = require('./usersDAO');

const  MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_ESHOP_URI;

class usersDAOMongo extends usersDAO{

    constructor(){
        super();
        this.client = new MongoClient(uri);
    }

    async findByName(name){

        try{
            console.log('Connecting to the db.eshop.users');
            console.log('Finding user',name);
            await this.client.connect();
            
            const db            = this.client.db('eshop');
            const collection    = db.collection('users');
            
            let query = {name: name};
            let options = {
                projections : {name:1,password:1}
            };
            return await collection.findOne(query,options);
        }
        finally{
            await this.client.close();
            console.log('Disconnecting from the db.eshop.users');
        }
    }

    async updateSessionId(name,sessionId){
        
        try{
            console.log('Connecting to the db.eshop.users');
            console.log('Updating user',name,'sessionsId');
            await this.client.connect();
            
            const db            = this.client.db('eshop');
            const collection    = db.collection('users');

            const filter = {name: name};
            const options = {upsert: false}; //DO NOT CREATE DOCUMENT IF USER EXISTS
            const updateDoc = {
                $set:{
                    sessionId: sessionId
                }
            };
            
           await collection.updateOne(filter,updateDoc,options);
        }
        finally{
            await this.client.close();
            console.log('Disconnecting from the db.eshop.users');
        }
    }
}

module.exports = usersDAOMongo;