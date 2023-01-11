# Tolis Eshop
This E-shop app created in the context of web developement course. 

# Technologies used in Client
Client's presentation is organized using HTML5 and CSS3. All the content requested from server is being integrated in the page using Handlebars templates. Client's logic is implemented using javascript.

# Technologies used in Server
All the services are implemented with Express framework. For the models, nonrelational DBMS mongoDB has been uesd.



# Services
## Services are designed according to REST

**POST -> /users/userId/login**

Since this method is called via the login form, the appropriate HTTP method is POST. The client fills outs a form with username and password and send these values to the server. The server validates the request and then respond to the client according to validation's result. If the validation was okay, a new item {sessionId: 'identifier'} is sent back to client, where identifier is produced via uuid library. Otherwise, server returns an authentication error 401.

**Response Codes**

200, if validation succeed

401, if username or password was invalid (authentication error)


**POST -> /carts/cartId**
This service adds a new item in the cart with this specific id

Since this call has effects on the server side, i.e a new record is added to the database, POST conforms best with HTTP semantics. The client sends a request to the server for the addition of a new product in his cart. In order for him to do that, he has to provide the sessionId token. If the token is valid, server respond with okay and then proccess the request. Otherwise, server returns an authentication error 401.

**Response Codes**

200, if token was valid

401, if token was invalid (authentication error)

**GET -> /carts/cartId/size**

Since this call only returns information to client GET conforms best with HTTP semantics. The client sends a request to recieve the total number of products in his cart. For security reasons he should provide the sessionId token. It's username and token are sent to the server as query parameters in the url. If the token is valid, then the server response with a JSON object {size: x}, where x is the amount of products in client's cart. Otherwise, server returns an authentication error 401.

**Response Codes**

200, if token was valid

401, if token was invalid (authentication error)

**GET /carts/cartId/**
This service returns all the product in the cart with this spedific id

Since this call only returns information to client GET conforms best with HTTP semantics. The client sends a request to get his full cart. Once the request is recievec, the server checks whether the user is authenticated or not. If the first case occurs, the server returns a JSON which contains all the products, otherwise returns 401 to declare that the user is not authoritative.

**JSON FORMAT**

	{   'title': product.title,

        'cost': product.cost,

        'quantity': product.quantity }

**Response Codes**

200, if token was valid

401, if token was invalid (authentication error)