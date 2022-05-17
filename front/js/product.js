// On récupère l'url de la page
let params = new URL(document.location).searchParams;
// On récupère l'id présent dans l'url et on le stock dans une variable
let id = params.get("id");
// On crée un objet vide prêt à recevoir les informations concernant l'article que l'on consulte
let article = {};

// On exécute notre requête en précisant à la fin l'id de l'article pour lequel on souhaite obtenir les informations
fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) =>
        response.json().then((data) => {
            displayProduct(data);
        }))
    .catch((error) => {
        console.log(error);
    });

// Fonction qui va nous permettre d'afficher les informations du produit grâce aux données récupérer,
// et de stocker les données concernant l'article dans un objet
function displayProduct(data) {
    const { imageUrl, name, price, description, colors, altTxt } = data;
    document.querySelector('.item__img').innerHTML =
        `<img src="${imageUrl}" alt="${altTxt}"></img>`
    document.querySelector('#title').innerHTML = name;
    document.querySelector('#price').innerHTML = price;
    document.querySelector('#description').innerHTML = description;
    for (let color of colors) {
        document.querySelector('#colors').innerHTML +=
            `<option value="${color}">${color}</option>`
    }
    article = {
        id: id,
        image: imageUrl,
        alt: altTxt,
        description: description,
        name: name,
        price: price,
    }
}

// On met l'écouteur sur le champ concernant la couleur
// pour le rajouter à notre objet une fois que l'utilisateur aura fait son choix
let color = document.querySelector('#colors').addEventListener('change', function (e) {
    article.color = e.currentTarget.value;
})
// On met également l'écouteur sur la quantité
// pour le rajouter à notre objet une fois que l'utilisateur saura combien il en veut
let quantity = document.querySelector('#quantity').addEventListener('change', function (e) {
    article.quantity = e.currentTarget.value;
})

// Une fois que l'utilisateur clique sur le bouton ajouter au panier, on envoie notre objet "Article"
// qui a récolté toutes les données jusqu'à présent dans la fonction qui va faire quelque vérification
// avant de l'ajouter au panier
let addToCart = document.querySelector('#addToCart').addEventListener("click", function () {
    if (article.color && article.quantity) {
        addProduct(article);
    }
});

function addProduct(article) {
    let produitLocalStorage = JSON.parse(localStorage.getItem("product"));
    console.log(article);
    if (article.color == undefined || article.quantity < 1) {
        alert("Merci de remplir tous les champs");
    } else if (produitLocalStorage) {
        checkProduct(article);
    } else {
        produitLocalStorage = [];
        produitLocalStorage.push(article)
        addedOnLocalStorage(produitLocalStorage);
    }
}
// On définis une variable que l'on passera a 'true' dans le cas ou l'article que l'on souhaite ajouter au panier 
// est déjà présent
let modify = false;
// On définis une variable que l'on passera a 'true' si l'article n'est pas déjà présent dans le panier 
// pour l'ajouter comme nouvelle article
let newArticle = false;

// Cette fonction va nous permettre de faire plusieurs vérifications afin d'éviter toutes erreurs
function checkProduct(produit) {
    // Ici nous récupérons le localStorage que l'on va stocker dans une variable
    let produitLocalStorage = JSON.parse(localStorage.getItem("product"));
    // Grâce à la boucle map nous allons pouvoir éplucher chacun des articles présents dans le localstorage
    produitLocalStorage = produitLocalStorage.map(el => {
        // Et vérifier si l'un deux corresponds à l'article que nous souhaitons ajouter
        if (el.id == produit.id && el.color == produit.color) {
            // Si c'est le cas nous stockons l'addition de la quantité d'article et celle déjà présente dans le panier
            let newNumber = parseInt(el.quantity) + parseInt(produit.quantity);
            // que l'on attribuera ensuite comme nouvelle quantité à l'élément déjà présent dans le panier
            el.quantity = String(newNumber);
            // Et nous passons ensuite la variable modify à "true" 
            modify = true;
            // Et renvoyer nos modifications dans notre variable produitLocalStorage
            return el;
        } else if ((el.color !== produit.color && el.id == produit.id) || (el.id !== produit.id)) {
            // Si aucun article ne correspond nous passons la variable newArticle à "true"
            newArticle = true;
            // et on renvoie également nos modifications dans la variable produitLocalStorage
            return el;
        }
    })
    animationButton();

    if (modify == true) {
        // Ici nous allons simplement nous contenter de ré-expéxier de nouveau dans le localStorage
        addedOnLocalStorage(produitLocalStorage);
        modify = false;
    } else if (newArticle == true) {
        // ici nous allons push notre nouvel article dans notre variable où l'on a récupéré
        // tous les articles déjà présents dans le localStorage
        produitLocalStorage.push(article)
        // avant de ré-expédier de nouveau dans le localStorage
        addedOnLocalStorage(produitLocalStorage);
        newArticle = false;
    }

};

// Animation qui va nous permettre de changer la couleur du bouton une fois qu'un article aura été ajouté a notre panier
function animationButton() {
    document.querySelector("#addToCart").textContent = "Ajouté à votre panier!";
    document.querySelector("#addToCart").style.background = "rgb(0, 205, 0)";
    setTimeout(function () {
        document.querySelector("#addToCart").style.background = "rgb(59, 59, 59)";
        document.querySelector("#addToCart").textContent = "Ajouter panier!";
    }, 500)
}

// Fonction qui va ajouter l'élément passer en paramètre dans le localStorage
function addedOnLocalStorage(product) {
    localStorage.setItem("product", JSON.stringify(product))
}