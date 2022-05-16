let panier = JSON.parse(localStorage.getItem("product"));
let prixFinal = 0;
let bool = false;
let indice = 0


if (panier !== null) {
  for (article of panier) {
    document.querySelector('#cart__items').innerHTML += `
      <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
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
                        <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article>`
    prixFinal += article.price * article.quantity
  }

} else {

  let b = document.body;
  let container = document.getElementById('cartAndFormContainer');
  let panierVide = document.createElement('h2');
  panierVide.textContent = `Il n'y a aucun article`;
  panierVide.style.textAlign = 'center';

  // On explique ici qu'on veut insérer notre élément h2 après le h1
  container.firstElementChild.parentNode.insertBefore(panierVide, container.firstElementChild.nextSibling)
}

document.querySelector('#totalPrice').innerHTML = prixFinal;
let buttonDelete = document.querySelectorAll('.deleteItem');

let changeQuantity = document.querySelectorAll('.itemQuantity');

for (el of changeQuantity) {
  let valeur = el;
  valeur.addEventListener('change', (e => {
    let cibleName = e.target.parentElement.parentElement.parentElement.children[0].children[0].innerText;
    let cibleColor = e.target.parentElement.parentElement.parentElement.children[0].children[1].innerText;
    panier = panier.map(element => {
      if (element.name == cibleName && element.color == cibleColor) {
        let newQuantity = parseInt(e.target.value);
        element.quantity = String(newQuantity);
        bool = true;
        return element;
      } else {
        return element;
      }
    })

    if (bool = true) {
      localStorage.setItem("product", JSON.stringify(panier))
      bool = false;
    }
  }))
}
let nouveauPanier = JSON.parse(localStorage.getItem("product"));

for (el of buttonDelete) {
  el.addEventListener('click', (e => {
    let cibleName = e.target.parentElement.parentElement.parentElement.children[0].children[0].innerText;
    let cibleColor = e.target.parentElement.parentElement.parentElement.children[0].children[1].innerText;

    panier = panier.map(element => {
      if (element.name == cibleName && element.color == cibleColor) {
        indice = panier.indexOf(element)
        nouveauPanier.splice(indice, 1);
        localStorage.setItem("product", JSON.stringify(nouveauPanier));
        window.location.reload();
        return panier;
      } else {
        return panier;
      }

    })

  }))
}

if (panier && panier.length == 0) {
  localStorage.clear();
  window.location.reload();
}



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
      window.location = `confirmation.html?${data.orderId}`;
      localStorage.clear();
    }))))
    .catch((error => console.log(error)))
}

let form = document.querySelector('.cart__order__form');

let firstNameBool = false;
let lastNameBool = false;
let addressBool = false;
let cityBool = false;
let emailBool = false;

checkForEnableButton()
form.order.addEventListener('click', (e => {
  e.preventDefault()

  let contact = {
    firstName: form.firstName.value,
    lastName: form.lastName.value,
    address: form.address.value,
    city: form.city.value,
    email: form.email.value,
  }

  let products = []

  for (article of panier) {
    products.push(article.id)
  }

  let obj = {
    contact,
    products,
  }
  console.log(JSON.stringify(obj))
  requestApiPost(obj);


}))


// Création de la reg exp pour la validation de l'e-mail
function validFirstName() {
  let firstNameRegExp = new RegExp('^[a-zA-Z\-\']+$');
  let firstNameCheck = document.querySelector('#firstNameErrorMsg');
  if (firstNameRegExp.test(firstName.value) && firstName.value.length > 1) {
    firstNameCheck.innerHTML = '';
    firstNameBool = true;
  } else {
    firstNameCheck.innerHTML = "Caractères autorisé : {a-z} {espace, -, '}"
    firstNameBool = false;
  }
}

function validLastName() {
  let lastNameRegExp = new RegExp('^[a-zA-Z\-\']+$');
  let lastNameCheck = document.querySelector('#lastNameErrorMsg');
  if (lastNameRegExp.test(lastName.value) && lastName.value.length > 1) {
    lastNameCheck.innerHTML = '';
    lastNameBool = true;
  } else {
    lastNameCheck.innerHTML = "Caractères autorisé : {a-z} {espace, -, '}"
    lastNameBool = false;
  }
}

function validCity() {
  let cityRegExp = new RegExp('^[a-zA-Z\-]+$');
  let cityCheck = document.querySelector('#cityErrorMsg');
  if (cityRegExp.test(city.value) && city.value.length > 1) {
    cityCheck.innerHTML = '';
    cityBool = true;
  } else {
    cityCheck.innerHTML = "Caractères autorisé : {a-z} {espace, -}"
    cityBool = false;
  }

}

function validAddress() {
  let addressRegExp = new RegExp('^[^@&"()!_$*€£`+=\/;?#]+$');
  let addressCheck = document.querySelector('#addressErrorMsg');
  if (addressRegExp.test(address.value) && address.value.length > 1) {
    addressCheck.innerHTML = '';
    addressBool = true
  } else {
    addressCheck.innerHTML = 'Les caractères spéciaux sont interdits.'
    addressBool = false
  }
}

function validEmail() {
  let emailRegExp = new RegExp(
    '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
  );
  let emailCheck = document.querySelector('#emailErrorMsg');
  if (emailRegExp.test(email.value) && email.value.length > 1) {
    emailCheck.innerHTML = '';
    emailBool = true;
  } else {
    emailCheck.innerHTML = 'Email invalide';
    emailBool = false;
  }

}

form.email.addEventListener('change', function () {
  validEmail(this);
  checkForEnableButton();
})

form.firstName.addEventListener('change', function () {
  validFirstName(this);
  checkForEnableButton();
})

form.lastName.addEventListener('change', function () {
  validLastName(this);
  checkForEnableButton();
})

form.city.addEventListener('change', function () {
  validCity(this);
  checkForEnableButton();
})

form.address.addEventListener('change', function () {
  validAddress(this);
  checkForEnableButton();
})

function checkForEnableButton() {
  if (!firstNameBool
    || !lastNameBool
    || !addressBool
    || !cityBool
    || !emailBool) {
    form.order.setAttribute('disabled', true);
  } else {
    form.order.removeAttribute('disabled');
  }
}