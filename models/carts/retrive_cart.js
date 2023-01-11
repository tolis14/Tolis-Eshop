const usersDAOMongo = require('../../dao/usersDAOMongo');
const cartsDAOMongo = require('../../dao/cartsDAOMongo');

function retriveCartService(req,res){
    
    console.log('');
    console.log('---------------------------');
    console.log('Got request for Cart Retrival');

    //Parameters of request
    let params = {
        name: req.query.userName,
        sessionId: req.query.sessionId
    };

    //Check if the cartId which which is the username is correct
    let cartIdInUrl = req.url.split('?')[0].split('/')[2];
    if(cartIdInUrl !== params.name){
        res.status(401).send();
        return;
    }

    let usersDAO = new usersDAOMongo();
    let queryResult = usersDAO.findByName(params.name);

    queryResult.then((user) => {
        
        if(user.sessionId !== params.sessionId){
            res.status(401).send();
            console.log('Fullfield request for Cart Retrival');
            console.log('---------------------------');
            console.log('');
        }
        else{
            let cartsDAO = new cartsDAOMongo();
            let result = cartsDAO.findUsersCart(user.name);
            result.then( (cart) => {
                
                let totalCost = 0;
                let products = [];
                
                for(let record of cart){
                    
                    let product = {
                        'title': record.product.title,
                        'cost': record.product.cost,
                        'quantity': record.product.quantity
                    }
                    totalCost = totalCost + ( parseFloat(record.product.cost) * record.product.quantity);
                    products.push(product);
                }
                let responseBody = {
                    'cartItems:': products,
                    'totalCost': totalCost
                }
                res.status(200).send(responseBody);
                console.log('Fullfield request for Cart Retrival');
                console.log('---------------------------');
                console.log('');
            });
        }
    });

}

module.exports = {retriveCartService};