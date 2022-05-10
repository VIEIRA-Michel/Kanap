let params = new URL(document.location).searchParams;
let id = params.get("id");
console.log(id)

let url = `http://localhost:3000/api/products/${id}`

fetch(url)
    .then((response) =>
        response.json().then((data) => {
            console.log(data);
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
        }))
    .catch((error) => {
        console.log(error);
    }

    )
