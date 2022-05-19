let url = `http://localhost:3000/api/products`

// Notre fonction qui exécute une requête fetch avec l'url de l'api en paramètre, afin de récupérer les données de tous les canapés
function getAllProducts(url) {
    fetch(url)
        .then((response) =>
            response.json().then((data) => {
                // Ici nous lui disons que dans le cas où nous recevons les données dans ce cas 
                // on les passes en paramètre de notre fonction qui va permettre d'afficher les données récupérer
                displayAllProducts(data);
            }))
        .catch((error) => {
            // Dans le cas contraire on affiche l'erreur dans la console
            console.log(error);
            // Et on affiche un message d'erreur sur le site pour que les utilisateurs comprennent que le site n'est pas disponible pour le moment
            let affichage = 'Notre site est en cours de maintenance, merci pour votre compréhension.';
            document.querySelector('#items').innerHTML = affichage;
        }
        )

}
getAllProducts(url);
function displayAllProducts(data) {
    let affichage = '';
    // Et pour chaque élément présent dans toutes les données récupérer
    for (let article of data) {
        // nous allons incrémenter notre variable affichage, de contenu HTML pré remplis
        // avec les données de chaque canapé récupérer via notre requête
        affichage +=
            `<a href="../product.html?id=${article._id}">
                    <article>
                    <img src="${article.imageUrl}" alt="${article.altTxt}">
                    <h3 class="productName">${article.name}</h3>
                    <p class="productDescription">${article.description}</p>
                    </article>
                </a>`
        // On va ensuite sélectionner la div parente, a laquelle on souhaite ajouter tout le contenu de notre variable
        // affichage où l'on a stocker tout le HTML avec leurs données à propos des canapés
        document.querySelector('#items').innerHTML = affichage;

    }
}