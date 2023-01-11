const local = 'http://localhost:8080/';


function displayCartProducts(cart){
    let productsTemplate = Handlebars.compile(document.getElementById('products_table_template').innerHTML);
    let filled = productsTemplate(cart);
    document.getElementById('table-output').innerHTML = filled;
}

function getCartProducts(){
    
    let params = (new URL(document.location)).searchParams;
  
    let userName = params.get('username');
    let sessionId = params.get('sessionId');

    let headers = new Headers();
    headers.append('Accept','application/json');

    let request = {
        method:'GET',
        headers: headers
    };

    let url = new URL(local + 'carts/' + userName);
    url.searchParams.append('userName',userName);
    url.searchParams.append('sessionId',sessionId);

    fetch(url,request)
        .then(response => response.json())
        .then(data => displayCartProducts(data))
        .catch(error => console.log(error));
}

function main(){
    getCartProducts();
}

window.onload = main;
