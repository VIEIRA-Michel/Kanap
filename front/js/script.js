let url = `http://localhost:3000/api/products`

fetch(url).then((response) =>
    response.json().then((data) => {
        console.log(data);
        let affichage = '';
        for (let article of data) {
            affichage += 
            `<a href="http://localhost:3000/api/products/${article._id}">
                <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description}</p>
                </article>
            </a>`
        }
        document.querySelector('#items').innerHTML = affichage;
    }))