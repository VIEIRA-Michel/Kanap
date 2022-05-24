// Ici nous récupérons le contenu de notre localStorage et le stockons dans la variable 'panier'
let panier = JSON.parse(localStorage.getItem("product"));
let produits = [];
// On récupère les données du panier pour les mettre dans notre variable produits;
produits = panier;

function getPrice(panier) {
    // on va exécuter une requête fetch afin de récupérer tout le catalogue de l'api
    fetch(`http://localhost:3000/api/products/`)
      .then((response) =>
        response.json().then((data) => {
          // on va boucler sur notre panier pour parcourir chacun des éléments
          panier = panier.map(element => 
            {
              // on va stocker l'index du produit ayant l'id correspondant dans le catalogue
              let index = data.findIndex(el => el._id == element.id);
              // si l'index est supérieur à -1
              if(index > -1) {
                // dans ce cas nous ajouterons la propriété price à notre élément et on lui attribuera la valeur du catalogue
                element.price = data[index].price;
              }
              return element;
            }
          )
          // on lance notre fonction de tri
          sortBasket(produits)
        }
        
        ))
      .catch((error) => {
        console.log(error);
      });
}
// Si notre panier n'existe pas ou qu'il est existant mais qu'il ne comporte rien on va exécuter notre fonction qui va nous afficher un message nous indiquant que notre panier est vide
if (panier == undefined || panier.length < 1) {
  emptyBasket();
} else if (panier && panier.length >= 1) {
  // Si notre panier comporte bien un produit on va déclencher la fonction qui va nous permettre de récupérer son prix
  getPrice(panier);
}
// Avec cette vérification on cherche à s'assurer que le panier n'est pas vide
function sortBasket(produits) {
  // console.log(produits);
  if (produits !== null) {
    // On lui passe la fonction sort afin de trier les articles dans notre panier
    // par ordre alphabétique afin de regrouper entre eux les modèles de canapé
    produits.sort(function compare(a, b) {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;
      return 0;
    })
    // une fois le panier trié on passe le résultat à notre fonction displayProductsOnBasket afin d'afficher le rendu
    displayProductsOnBasket(produits);
  }
}

function displayProductsOnBasket(produits) {
  // On va boucler sur chaque article présent dans notre panier 
  for (article of produits) {
    // et incrémenter la div #cart__items de contenu html pré remplis avec les données de chacun des produits
    document.querySelector('#cart__items').innerHTML += `
      <article class="cart__item" data-id="${article.id}" data-color="${article.color}">
                  <div class="cart__item__img">
                    <img src="${article.image}" alt="${article.alt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__description">
                      <h2>${article.name}</h2>
                      <p>${article.color}</p>
                      <p>${article.price} €</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.quantity}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p class="deleteItem" data-id="${article.id}" data-color="${article.color}">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article>`
  }
  // Et mettre à l'écoute les fonctions pour calculer le prix, changer la quantité, ainsi que supprimer un article
  calculatePrice();
  changeQuantity(produits);
  deleteArticle(produits);
}

function emptyBasket() {
    // dans le cas ou notre panier est existant, mais que sa longueur est de 0
    if (panier && panier.length == 0) {
      // On vide le localStorage
      localStorage.clear();
      // et on rafraîchit la page
      window.location.reload();
    }
  // Nous allons ici sélectionner la div parente #cartAndFormContainer et la stocké dans une variable
  let container = document.getElementById('cartAndFormContainer');
  // Créer un h2 et le stocké dans une variable que l'on appelera panierVide
  let panierVide = document.createElement('h2');
  // Changer son contenu par le suivant
  panierVide.textContent = `Il n'y a aucun article`;
  // lui ajouter une propriété css afin qu'il soit aligné au centre
  panierVide.style.textAlign = 'center';
  // On explique ici qu'on veut insérer notre élément h2 après le premier enfant qui est le h1 de notre div parente #cartAndFormContainer 
  container.firstElementChild.parentNode.insertBefore(panierVide, container.firstElementChild.nextSibling)
  // On va sélectionner la balise contenant le prix et lui attribuer la valeur '0' étant donné que le panier est vide
  document.querySelector('#totalPrice').innerHTML = '0'
}

// Cette fonction va nous permettre de calculer le prix total de tous les articles présents dans le panier
function calculatePrice() {
  // On définis le prix final de base à 0
  prixFinal = 0;
  // On va parcourir chacun des produits présents dans le panier
  if (produits !== null) {
    for (product of produits) {
      // On crée une variable contenant un tableau vide qui contiendra la somme de chacun des canapés
      let priceTotal = []
      // On va ajouter a notre tableau le prix total de chacun des articles en multipliant leur prix par la quantité présente dans le panier
      priceTotal.push(product.price * product.quantity);
      // Et on va boucler afin de calculer le cumul des sommes de chacun des articles présents dans le panier
      for (let i = 0; i < priceTotal.length; i++) {
        // Et le stocker dans une variable qui va être incrémenté pour chaque article dans le panier
        prixFinal += priceTotal[i]
      }
    }
  }
  // Pour par la suite cibler la balise contenant le prix total et lui assigner le prix
  document.querySelector('#totalPrice').innerHTML = prixFinal;
}

// On crée une variable contenant un booléen qu'on définis sur false
let modifQuantity = false;

function changeQuantity(produits) {
  // On sélectionne la carte dans son intégralité afin de récupérer les données des datasets
  const cards = document.querySelectorAll(".cart__item");
  // on va boucler sur 'cards' afin d'avoir accès à ses enfants
  cards.forEach((card) => {
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné
    card.addEventListener("change", (event) => {
      // vérification d'information de la valeur du clic et son positionnement dans les articles
      let panier = JSON.parse(localStorage.getItem("product"));
      // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
      for (article of produits)
        if (
          article.id == card.dataset.id &&
          card.dataset.color == article.color
        ) {
            for(element of panier) {
              if (element.id == card.dataset.id && element.color == card.dataset.color) {
                article.quantity = event.target.value;
                element.quantity = article.quantity;
              }
            }
          // Nous allons appliqué directement dans l'article présent dans le localStorage
          // la nouvelle quantité que l'on a sélectionné
          // On va expédier dans le localSxtorage notre panier fraîchement modifié
          localStorage.setItem("product", JSON.stringify(panier));
          // puis recalculer le prix, car les quantités ont changé
          calculatePrice();
          // window.location.reload();
        }
    });
  });
}

function deleteArticle(produits) {
  // ici on récupère le contenue de notre panier et on le stock dans un nouveau panier
  let nouveauPanier = JSON.parse(localStorage.getItem("product"));
  // console.log("avant le sort", nouveauPanier)
  // on va le trier afin que chaque index corresponde avec notre panier principal
  nouveauPanier.sort(function compare(a, b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  })

  // Ici on va sélectionner toutes les balises deleteItem
  let buttonDelete = document.querySelectorAll('.deleteItem');
  // On boucle pour écouter par la suite tous les boutons delete
  for (el of buttonDelete) {
    // Et être à l'écoute dans le cas ou l'on clic sur l'un d'entre eux
    el.addEventListener('click', (e => {
      // On va parcourir chaque élément présent dans notre panier
      panier = panier.map(element => {
        // Si un élément dans le panier a le même id et la même couleur que celui sur lequel nous avons cliqué pour le supprimer
        if (element.id == e.target.dataset.id && element.color == e.target.dataset.color) {
          // On récupère l'index de l'élément en question
          let indice = panier.indexOf(element)
          // on supprime l'élément grâce à son index dans notre nouveau panier
          nouveauPanier.splice(indice, 1);
          // Et on va expédier notre nouveau panier dans le localStorage
          localStorage.setItem("product", JSON.stringify(nouveauPanier));
          // On rafraîchit la page
          window.location.reload();
          // On enregistre les modifications dans le panier
          return panier;
        } else {
          return panier;
        }
      })
    }))
  }
  // dans le cas ou notre panier est existant, mais que sa longueur est de 0
  if (produits && produits.length == 0) {
    // On vide le localStorage
    localStorage.clear();
    // et on rafraîchit la page
    window.location.reload();
  }
}


// Notre requête qui va nous permettre d'envoyer notre commande comprenant notre fiche contact ainsi que notre panier
function requestApiPost(command) {
  const requestPost = fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    body: JSON.stringify(command),
    headers: {
      "Content-Type": "application/json",
    },
  });
  requestPost.then((response => response.json()
    .then((data => {
      // ici on souhaite être re-dirigé sur la page de confirmation après l'exécution de la requête
      // et on passe le numéro de transaction dans l'url afin de le récupérer plus tard
      window.location = `confirmation.html?${data.orderId}`;
      // On vide également notre panier en nettoyant le localStorage
      localStorage.clear();
    }))))
    .catch((error => console.log(error)))
}

function SendCommand() {
  // On crée une variable avec à l'intérieur un tableau vide
  let products = []
  // On va boucler pour parcourir chacun des éléments dans notre panier
  for (article of panier) {
    // pour chaque article présent dans notre panier on va ajouter son id à notre tableau
    products.push(article.id)
  }
  // On crée l'objet qui va contenir notre fiche contact avec la saisie de chacun des champs
  // ainsi que le tableau avec les id des produits présents dans notre panier
  let obj = {
    contact: {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      address: form.address.value,
      city: form.city.value,
      email: form.email.value,
    },
    products,
  }
  // Pour finir on passe notre objet en paramètre de notre requête
  requestApiPost(obj);
}

// Notre fonction qui va permettre de vérifier si certaines règles sont respectées
function validInput(regExp, elementId, inputValue, validationText) {
  // Ici nous créons une variable qui contiendra la regex qu'on lui a passé en paramètre
  let regex = new RegExp(regExp);
  // Nous sélectionnons ensuite l'id correspondant passer en paramètre
  let selectorId = document.querySelector(elementId);
  // si la saisie rentre bien dans les critères de la regex et que le champ n'est pas vide
  if (regex.test(inputValue) && inputValue.length > 1) {
    // On retire le précédent message d'erreur s'il y en a eu un
    selectorId.innerHTML = '';
    // et on lui retourne 'true' pour lui indiquer que le champ est correctement remplis
    return true;
    // si la saisie ne respecte pas les règle appliquer par la regex, ou si le champ est vide
  } else {
    selectorId.innerHTML = validationText;
    return false;
  }
}

// On définis plusieurs variables qui vont nous permettre par la suite de contrôler la bonne saisie de chacun des champs
let firstNameBool = false;
let lastNameBool = false;
let addressBool = false;
let cityBool = false;
let emailBool = false;

// Ici on sélectionne le formulaire et on l'enregistre dans une variable
let form = document.querySelector('.cart__order__form');
// On lance notre fonction afin quelle désactive le bouton commander pour éviter toute erreur
// Étant donné que pour l'instant tous les champs sont vide
checkForEnableButton()
// On place l'écouteur sur le bouton 'commander' pour qu'une fois que l'on clique
form.order.addEventListener('click', (e => {
  // Éviter le rechargement de la page
  e.preventDefault()
  // Et envoyer notre commandes l'API
  SendCommand();
}))

// Ici nous allons boucler sur chaque enfant du formulaire
for (champ of form) {
  // Et lui poser un écouteur dessus pour écouter le changement lors du clic en dehors du champ
  champ.addEventListener('change', function (e) {
    // Selon le champ sur lequel nous allons cliquer pour faire une saisie
    switch (e.target.name) {
      // cela déclenchera notre fonction global avec des paramètres différents, selon le champ sur lequel nous aurons cliqué
      case 'firstName':
        firstNameBool = validInput('^[a-zA-Z\-\']+$', '#firstNameErrorMsg', e.target.value, "Caractères autorisé : {a-z} {espace, -, '}");
        break;
      case 'lastName':
        lastNameBool = validInput('^[a-zA-Z\-\']+$', '#lastNameErrorMsg', e.target.value, "Caractères autorisé : {a-z} {espace, -, '}");
        break;
      case 'address':
        addressBool = validInput('^[^@&"()!_$*€£`+=\/;?#]+$', '#addressErrorMsg', e.target.value, 'Les caractères spéciaux sont interdits.');
        break;
      case 'city':
        cityBool = validInput('^[a-zA-Z\-]+$', '#cityErrorMsg', e.target.value, 'Caractères autorisé : {a-z} {espace, -}');
        break;
      case 'email':
        emailBool = validInput('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', '#emailErrorMsg', e.target.value, 'Email invalide');
        break;
    }
    // Et après chaque saisie on exécutera notre fonction qui nous permettra de savoir si tous les champs sont remplis et valide
    checkForEnableButton();
  })
}
// Cette fonction va nous permettre de vérifier si chacun des champs est correctement rempli
function checkForEnableButton() {
  if (!firstNameBool
    || !lastNameBool
    || !addressBool
    || !cityBool
    || !emailBool) {
    // si ce n'est pas le cas nous allons désactiver le bouton qui va nous permettre de commander
    form.order.setAttribute('disabled', true);
  } else {
    // et si tout est bien rempli le bouton est activé
    form.order.removeAttribute('disabled');
  }
}
