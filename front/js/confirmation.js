let params = new URLSearchParams(document.location.search);
let orderId = params.get("id"); 

document.getElementById('orderId').innerHTML = orderId;