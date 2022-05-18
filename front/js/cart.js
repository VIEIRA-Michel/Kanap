// Ici nous récupérons le contenu de notre localStorage et le stockons dans la variable 'panier'
let panier = JSON.parse(localStorage.getItem("product"));

// Avec cette vérification on cherche à s'assurer que le panier n'est pas vide
if (panier !== null) {
  panier.sort(function compare(a, b) {
    if (a.name < b.name)
       return -1;
    if (a.name > b.name )
       return 1;
    return 0;
  });
  // S'il ne l'est pas nous allons boucler sur chaque article présent dedans
  for (article of panier) {
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
  // On lance la fonction qui va permettre de calculer le prix ainsi que celle qui va permettre de changer la quantité afin de modifier
  // dynamiquement l'affichage
  calculatePrice();
  changeQuantity();
  deleteArticle();
  //  dans le cas contraire
} else {

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
  // On récupère le contenu de notre panier et on le stock dans une variable du même nom
  let panier = JSON.parse(localStorage.getItem("product"));
  // On va parcourir chacun des produits présents dans le panier
  for (product of panier) {
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
  // Pour par la suite cibler la balise contenant le prix total et lui assigner le prix
  document.querySelector('#totalPrice').innerHTML = prixFinal;
}

function changeQuantity() {
  // Ici on sélectionne tous les champs qui vont permettre de changer la quantité
  let changeQuantity = document.querySelectorAll('.itemQuantity');
  // On crée une variable contenant un booléen qu'on définis sur false
  let modifQuantity = false;
  for (el of changeQuantity) {
    el.addEventListener('change', (e => {
      // Ici nous allons parcourir chacun des éléments présents dans le panier
      panier = panier.map(element => {
        console.log(el.dataset)
        // Si l'élément pour lequel nous avons changé la quantité, a le même id et la même couleur qu'un élément déjà présent dans le panier
        if (element.id == el.dataset.id && element.color == el.dataset.color) {
          // Nous allons enregistrer dans une variable la nouvelle quantité que l'on a sélectionné
          let newQuantity = parseInt(e.target.value);
          // Et l'attribué à l'élément déjà présent dans notre panier
          element.quantity = String(newQuantity);
          // Passer la valeur de notre booléen à true
          modifQuantity = true;
          // enregistrer les modifications
          return element;
        } else {
          return element;
        }
      })
      // si notre booléen est à true
      if (modifQuantity = true) {
        // On va expédier dans le localStorage notre panier fraîchement modifié
        localStorage.setItem("product", JSON.stringify(panier))
        // recalculer le prix, car les quantités ont changé
        calculatePrice();
        // et repasser notre booléen à false
        modifQuantity = false;
      }
    }))
  }
}


function deleteArticle() {
  // ici on récupère le contenue de notre panier et on le stock dans un nouveau panier
  let nouveauPanier = JSON.parse(localStorage.getItem("product"));
  // Ici on va sélectionner toutes les balises deleteItem
  let buttonDelete = document.querySelectorAll('.deleteItem');
  // On définit une variable qui va nous servir d'indice, sur 0
  let indice = 0
  // On boucle pour écouter par la suite tous les boutons delete
  for (el of buttonDelete) {
    // Et être à l'écoute dans le cas ou l'on clic sur l'un d'entre eux
    el.addEventListener('click', (e => {
      // On va parcourir chaque élément présent dans notre panier
      panier = panier.map(element => {
        // Si un élément dans le panier a le même id et la même couleur que celui sur lequel nous avons cliqué pour le supprimer
        if (element.id == el.dataset.id && element.color == el.dataset.color) {
          // On récupère l'index de l'élément en question
          indice = panier.indexOf(element)
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
  if (panier && panier.length == 0) {
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
  // Et envoyer notre commande vers l'API
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
