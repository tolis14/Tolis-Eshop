const target = 'https://wiki-shop.onrender.com';
const local = 'http://localhost:8080/';
var map;
var productsTemplate;
var filtersTemplate;
var allProducts;
var loginForm;
var sessionId;
var userLogged = false;
var userName;

function getCartSize(){
    
    let headers = new Headers();
    headers.append('Accept','application/json');

    let request = {
        method:'GET',
        headers: headers
    };

    let url = new URL(local + 'carts/' + userName + '/size');
    url.searchParams.append('userName',userName);
    url.searchParams.append('sessionId',sessionId);

    fetch(url,request)
        .then(response => response.json())
        .then(data => updateCart(data.size))
        .catch(error => console.log(error));
}

function updateCart(size){
    
    let totalProductsItem = document.getElementById('total_products_in_cart');
    let totalProductsCounter = parseInt(totalProductsItem.innerHTML);
    totalProductsCounter = totalProductsCounter + size;
    totalProductsItem.innerHTML = totalProductsCounter;
}

function onLoginLayout(){
    loginForm.style.display = 'none';
    let loginButton = document.querySelector('#login_button');
    loginButton.innerHTML = userName;
    loginButton.disabled = true;
}

function login(form){
    
    let formData = new FormData(form);
    userName = formData.get('user-name'); 
    
    let body = new URLSearchParams(formData).toString();

    let headers = new Headers();
    headers.append('Content-type','application/x-www-form-urlencoded');
    
    let request = {
        method: 'POST',
        headers: headers,
        body: body
    };

    let url = local + 'users/' + userName +'/login';


    fetch(url,request)
        .then(response => {
            
            if(response.status !== 200){
                throw new Error(response.status);
            }
            else{
                return response.json();
            }
        })
        .then(data => {
            sessionId = data.sessionId;
            userLogged = true;
            let errorSpan = document.getElementById('login-status');
            errorSpan.innerHTML = 'You have been logged successfully';
            errorSpan.style.color = 'green';
            onLoginLayout();
            getCartSize();
        })
        .catch( error => {
            let errorSpan = document.getElementById('login-status');
            errorSpan.innerHTML = 'Invalid username or password';
            errorSpan.style.color = 'red';
        });
}

function getProductsAndSubCategories(){
    
    let params = (new URL(document.location)).searchParams;
    let id = params.get('categoryID');
    
    let productsUrl = target + '/categories/' + id + '/products';
    let subCategoriesUrl = target + '/categories/' + id + '/subcategories';
    let urls = [productsUrl,subCategoriesUrl];

    let headers = new Headers();
    headers.append('Accept','application/json');

    let request = {
        method: 'GET',
        headers: headers
    };


    Promise.all(urls.map(url => fetch(url,request)))
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(jsonsData => {
            
            let products = allProducts =jsonsData[0];
            let subcategories = jsonsData[1];
            
            for(let subCategory of subcategories){
                subCategory.title = subCategory.title.replace(/\s/g, '');
            }

            let filled = productsTemplate(products);
            document.getElementById('output_products').innerHTML = filled;

            filled = filtersTemplate(subcategories);
            document.getElementById('filters').innerHTML = filled;
            
            initRadios();
            initDescriptionButtons();
            initAddToCartButtons();

            map = createProductsMap(products,subcategories);
        })
        .catch((error) => {
            console.log('Error:',error);
        });

}

function createProductsMap(products, subcategories){

    let map = new Map();

    for(let subCategory of subcategories){
        
        let title = subCategory.title;
        let id = subCategory.id;

        let subProducts = products.filter( (product) => product.subcategory_id === id );
        map.set(title,subProducts);
    }

    return map;
}

function initRadios(){

    let radios = Array.from(document.querySelectorAll("input[type = 'radio']"));
    
    radios.forEach(radio => {
        radio.addEventListener('change',(event) => {
            
            let subCategoryTitle = radio.dataset.subcategoryName;

            if(subCategoryTitle !== 'all'){
                let products = map.get(subCategoryTitle);
                let filled = productsTemplate(products);
                document.getElementById('output_products').innerHTML = filled;
            }
            else{
                let filled = productsTemplate(allProducts);
                document.getElementById('output_products').innerHTML = filled;
            }
            initDescriptionButtons();
            initAddToCartButtons();
        });
    });
}

function initFunctionalities(){

    loginForm = document.querySelector('#login_form');

    let loginButton = document.querySelector('#login_button');
    
    loginButton.addEventListener('click',(event) => {
        loginForm.style.display = 'block';
    });
        
    window.onclick = function(event){
        if(event.target === loginForm){
            loginForm.style.display = 'none';
        }
    };

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(userLogged === false)
            login(event.target);
    });

    let displayCartButton = document.getElementById('display_cart_button');
    
    displayCartButton.addEventListener('click', (event) =>{
        
        event.preventDefault();
        if(userLogged){
            let href = local + 'cart.html';
            let url = new URL(href);
            url.searchParams.append('username',userName);
            url.searchParams.append('sessionId',sessionId);
            window.open(url,"_self");
        }
        else{
            loginForm.style.display = 'block';
        }
    });
}

function initDescriptionButtons(){

    let buttons = Array.from(document.querySelectorAll(".expand_desc_button"));

    buttons.forEach( (button) => {
    
        button.addEventListener('click', (event) => {
            
            let state = button.innerHTML;
            
            let id = 'fully_description_' + button.dataset.productId;
            let paragraphToBeFilled = document.querySelector('#'+id);

            if(state === 'view description'){
                paragraphToBeFilled.style.display = 'block';
                paragraphToBeFilled.style.fontWeight = 'lighter';
                button.innerHTML = 'hide description';
            }
            else{
                paragraphToBeFilled.style.display = 'none';
                button.innerHTML = 'view description';
            }            
        });
    });
}

function initAddToCartButtons(){

    let addToCartButtons = document.querySelectorAll('.add_to_cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click',(event) => {

            if(userLogged){
                
                let headers = new Headers();
                headers.append('Content-Type','application/json');
                
                let requestBody = {
                    sessionId: sessionId,
                    name: userName,
                    product:{   id: button.dataset.prodId,
                                title: button.dataset.prodTitle, cost: button.dataset.prodTitle,
                                cost: button.dataset.prodCost}
                };

                let request = {
                    method:'POST',
                    headers: headers,
                    body: JSON.stringify(requestBody)
                };

                let url = local + 'carts/' + userName;
                
                fetch(url,request)
                    .then((response) => {

                        if(response.status === 200){
                            console.log('new item added to your cart');
                            updateCart(1);
                        }
                        else{
                            throw new Error(response.status);
                        }
                    })
                    .catch(error => console.log(error));
                    
            }
            else{
                loginForm.style.display = 'block';
            }
        });
    });
}

function CompileTemplates(){
    productsTemplate = Handlebars.compile(document.getElementById('products_template').innerHTML);
    filtersTemplate = Handlebars.compile(document.getElementById('filters_template').innerHTML);
}

function main(){
    initFunctionalities();
    CompileTemplates();
    getProductsAndSubCategories();
}

window.onload = main;