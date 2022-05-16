let params = new URL(document.location).searchParams;
let id = params.get("id");
let modify = false;
let newArticle = false;

let url = `http://localhost:3000/api/products/${id}`

fetch(url)
    .then((response) =>
        response.json().then((data) => {
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
            document.querySelector('#addToCart').addEventListener("click", function () {
                let color = document.querySelector('#colors');
                let quantity = document.querySelector('#quantity');

                let produit = {
                    id: id,
                    image: imageUrl,
                    alt: altTxt,
                    description: description,
                    name: name,
                    color: color.value,
                    price: price,
                    quantity: quantity.value,

                }
                console.log(produit.color);
                let produitLocalStorage = JSON.parse(localStorage.getItem("product"));

                function addProductOnLocalStorage() {
                    produitLocalStorage.push(produit)
                    localStorage.setItem("product", JSON.stringify(produitLocalStorage))
                }


                if (produit.color == "" || produit.quantity < 1) {
                    alert("Merci de remplir tous les champs");
                } else if (produitLocalStorage) {
                    document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
                    document.querySelector("#addToCart").textContent = "Ajouté à votre panier!";
                    setTimeout(function () {
                        document.querySelector("#addToCart").style.color = "rgb(255, 255, 255)";
                        document.querySelector("#addToCart").textContent = "Ajouter panier!";
                    }, 500)
                    produitLocalStorage = produitLocalStorage.map(el => {
                        if (el.id == produit.id && el.color == produit.color) {
                            let newNumber = parseInt(el.quantity) + parseInt(produit.quantity);
                            el.quantity = String(newNumber);
                            modify = true;
                            return el;
                        } else if ((el.color !== produit.color && el.id == produit.id) || (el.id !== produit.id)) {
                            newArticle = true;
                            return el;
                        }
                    })
                    if (modify == true) {
                        localStorage.setItem("product", JSON.stringify(produitLocalStorage));
                        modify = false;
                    } else if (newArticle == true) {
                        addProductOnLocalStorage();
                        newArticle = false;
                    }

                } else {
                    produitLocalStorage = [];
                    addProductOnLocalStorage();
                }
            });
        }))
    .catch((error) => {
        console.log(error);
    });