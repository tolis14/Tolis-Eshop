const usersDAOMongo = require('../../dao/usersDAOMongo');
const cartsDAOMongo = require('../../dao/cartsDAOMongo');

function getCartSizeService(req,res){
    
    console.log('');
    console.log('---------------------------');
    console.log('Got request for Cart Size');
    
    //Parameters of request
    let params = {
        name: req.query.userName,
        sessionId: req.query.sessionId
    };

    //Check if name in the url is different from name in parameters
    let cartIdInUrl = req.url.split('/')[2];
    if(cartIdInUrl !== params.name){
        res.status(401).send();
        return;
    }

    let usersDAO = new usersDAOMongo();
    let queryResult = usersDAO.findByName(params.name);

    queryResult.then((user) =>{

        if(user.sessionId !== params.sessionId){
            res.status(401).send();
        }
        else{
            let cartsDAO = new cartsDAOMongo();
            let cartsSizeResult = cartsDAO.getCartSize(user.name);
            cartsSizeResult.then(cartSize => {
                let responseBody = {size: cartSize};
                res.status(200).send(responseBody);
                console.log('Fullfilled the request for Cart size');
                console.log('---------------------------');
                console.log('');
            });
        }
    });
}

module.exports = {getCartSizeService};