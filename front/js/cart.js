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
        console.log(nouveauPanier);
        indice = panier.indexOf(element)
        console.log('voici lindice' + indice);
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
  console.log("supprimer");
  localStorage.clear();
  window.location.reload();
}

let firstName = document.querySelector('#firstName');
let lastName = document.querySelector('#lastName');
let address = document.querySelector('#address');
let city = document.querySelector('#city');
let email = document.querySelector('#email');

let contact = {
  firstName: toString(firstName.value),
  lastName: toString(lastName.value),
  address: toString(address.value),
  city: toString(city.value),
  email: toString(email.value),
}

let products = []

for(article of panier) {
  products.push(article.id)
}

const obj = {
  contact,
  products,
}
function requestApiPost() {
  const requestPost = fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  requestPost.then((response => response.json()
    .then((data => console.log(data)))))
  .catch((error => console.log(error)))
}


document.querySelector('#order').addEventListener('click', (e => {
  e.preventDefault()
  console.log(JSON.stringify(obj))
  requestApiPost();
}))


