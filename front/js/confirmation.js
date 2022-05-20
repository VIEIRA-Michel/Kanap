// Ici on crée une variable ou l'on stock une partie de l'url de la page
let url = document.location.search;

function displayOrderId(url) {
    // ici on précise qu'on veut récupérer du caractère à l'index 1 jusqu'au caractère à l'index 37
    let result = url.substring(1, 37);
    // on sélectionne la balise orderId et on lui applique la série de lettres et de chiffres qu'on vient de récupérer
    document.querySelector('#orderId').innerHTML = result;
    // en ajoutant un petit message de remerciement à la fin
    document.querySelector("#orderId").innerHTML = `<br>${result}<br>Merci pour la confiance que vous nous accordez `;
}
displayOrderId(url);
