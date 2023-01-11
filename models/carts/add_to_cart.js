
const usersDAOMongo = require('../../dao/usersDAOMongo');
const cartsDAOMongo = require('../../dao/cartsDAOMongo');

function addToCartService(req,res){

    console.log('');
    console.log('---------------------------');
    console.log('Got request for Adding to Cart');

    let requestBody = req.body;
    
    let sessionId   = requestBody.sessionId;
    let name        = requestBody.name;
    let product     = requestBody.product;

    //Check if name in the url is different from name in body
    let cartIdInUrl = req.url.split('/')[2];
    if(cartIdInUrl !== name){
        res.status(401).send();
        return;
    }

    let usersDAO = new usersDAOMongo();
    let queryResult = usersDAO.findByName(name);
    
    queryResult.then((user) =>{

        if(user.sessionId !== sessionId){
            res.status(401).send();
            console.log('Fullfield request for Adding to Cart');
            console.log('---------------------------');
            console.log('');
        }
        else{
            res.status(200).send();
            let cartsDAO = new cartsDAOMongo();
            cartsDAO.addToCart(name,product)
                .then(() => {
                    console.log('Fullfield request for Adding to Cart');
                    console.log('---------------------------');
                    console.log('');
                });
        }
    });
}

module.exports = {addToCartService};