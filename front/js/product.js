let params = new URL(document.location).searchParams;
let id = params.get("id");
console.log(id)

let url = `http://localhost:3000/api/products/${id}`

fetch(url)
    .then((response) =>
        response.json().then((data) => {
            console.log(data);
            let affichage = '';
        }))
    .catch((error) => {
        console.log(error);
        let affichage = 'Notre site est en cours de maintenance, merci pour votre compréhension.';
        document.querySelector('#items').innerHTML = affichage;
    }

    )
