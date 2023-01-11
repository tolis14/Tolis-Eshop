
const uuidv4 = require('uuid');

const usersDAOMongo = require('../../dao/usersDAOMongo');

/*
    VALID CREDENTIALS   : HTTP RESPONSE CODE == 200
    INVALID CREDENTIALS : HTTP RESPONSE CODE == 401 see RFC 7235
*/

function loginService(req,res){

    console.log('');
    console.log('---------------------------');
    console.log('Got request for login');

    let usersDAO = new usersDAOMongo();
    
    let requestBody = req.body;
    let userName    = requestBody['user-name'];
    let userPwd     = requestBody['user-password'];

    //Check if name in the url is different from name in body
    let userIdInUrl = req.url.split('/')[2];
    if(userName !== userIdInUrl){
        res.status(401).send();
        return;
    }

    let queryResult = usersDAO.findByName(userName);

    queryResult.then((user) => {

        if(!user){        
            res.status(401).send();
            console.log('Fullfilled the request for login');
            console.log('---------------------------');
            console.log('');
        }
        else{
            if(userPwd === user.password){
                
                let sessionId = uuidv4.v4();

                let responseBody = {
                    sessionId: sessionId
                };
    
                //first update the session id in the database and then send response with the new session id
                usersDAO.updateSessionId(user.name,sessionId)
                    .then(() => {
                        res.status(200).send(responseBody);
                        console.log('Fullfilled the request for login');
                        console.log('---------------------------');
                        console.log('');
                    });
            }
            else{
                res.status(401).send();
                console.log('Fullfilled the request for login');
                console.log('---------------------------');
                console.log('');
            }
        }
    });
}


module.exports = {loginService};