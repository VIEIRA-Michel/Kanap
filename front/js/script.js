let url = `http://localhost:3000/api/products`

// Ici nous exécutons une requête fetch avec l'url de l'api passer en paramètre afin de récupérer leurs données à propos des articles
fetch(url)
    .then((response) =>
        response.json().then((data) => {
            let affichage = '';
            // Et pour chaque élément présent dans toutes les données récupérer
            for (let article of data) {
                // nous allons incrémenter notre variable affichage, de contenu HTML pré remplis
                // avec les données de chaque canapé récupérer via notre requête
                affichage +=
                    `<a href="../html/product.html?id=${article._id}">
                <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class="productName">${article.name}</h3>
                <p class="productDescription">${article.description}</p>
                </article>
            </a>`
            }
            // On va ensuite sélectionner la div parente, a laquelle on souhaite ajouter tout le contenu de notre variable
            // affichage où l'on a stocker tout le HTML avec leurs données à propos des canapés
            document.querySelector('#items').innerHTML = affichage;
        }))
    .catch((error) => {
        console.log(error);
        let affichage = 'Notre site est en cours de maintenance, merci pour votre compréhension.';
        document.querySelector('#items').innerHTML = affichage;
    }

    )