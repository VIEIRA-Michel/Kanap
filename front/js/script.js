let url = `http://localhost:3000/api/products`

fetch(url)
    .then((response) =>
        response.json().then((data) => {
            console.log(data);
            let affichage = '';
            for (let article of data) {
                affichage +=
                    `<a href="../html/product.html?id=${article._id}">
                <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description}</p>
                </article>
            </a>`
            }
            document.querySelector('#items').innerHTML = affichage;
        }))
    .catch((error) => {
        console.log(error);
        let affichage = 'Notre site est en cours de maintenance, merci pour votre compréhension.';
        document.querySelector('#items').innerHTML = affichage;
    }

    )