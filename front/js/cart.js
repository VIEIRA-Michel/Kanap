let panier = JSON.parse(localStorage.getItem("product"));
let prixFinal = 0;
let bool = false;

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

document.querySelector('#totalPrice').innerHTML = prixFinal;

let changeQuantity = document.querySelectorAll('.itemQuantity');

for (el of changeQuantity) {
  let valeur = el;
  valeur.addEventListener('change', (e => {
    let cibleName = e.target.parentElement.parentElement.parentElement.children[0].children[0].innerText;
    let cibleColor = e.target.parentElement.parentElement.parentElement.children[0].children[1].innerText;
    panier = panier.map(element => {
      if (element.name == cibleName && element.color == cibleColor) {
        let newQuantity =  parseInt(e.target.value);
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
