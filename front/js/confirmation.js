let url = document.location.search;
let result = url.substring(1, 37)
document.querySelector('#orderId').innerHTML = result