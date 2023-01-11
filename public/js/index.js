const target = 'https://wiki-shop.onrender.com';

function getCategories(){

    let url = target + '/categories';
    
    let headers = new Headers();
    headers.append('Accept','application/json');

    let request = {
        method: 'GET',
        headers: headers
    };

    fetch(url,request)
        .then(response => response.json())
        .then((data) => {
            
            let template = Handlebars.compile(document.getElementById('categories_template').innerHTML);
            let filled = template(data);
            document.getElementById('output_categories').innerHTML = filled;
            initLinks();
        })
        .catch((error) => {
            console.log('Error:',error);
        });
}

function initLinks(){
    
    links = Array.from(document.querySelectorAll(".category-link"));
    
    links.forEach(link => {
        
        link.onclick = (event) => {
            
            event.preventDefault();
            let href = link.href;
            let id = link.dataset.categoryId;

            let url = new URL(href);
            url.searchParams.append('categoryID',id);
            window.open(url,"_self");
        };

    });
}

window.onload = getCategories;