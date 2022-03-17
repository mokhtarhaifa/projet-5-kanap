let basket = JSON.parse(localStorage.getItem('basket'));
const section = document.getElementById("cart__items")

if (basket) {

	basket.forEach(function(item, index) {
		const url = fetch("http://localhost:3000/api/products/" + item.idproduct);
		url
			.then(response => response.json())
			.then(function(data) {

				// creation des balises html utulisé pour afficher details produit
				const article = document.createElement("article");
				article.classList.add("cart__item");
				article.setAttribute("data-id", item.idproduct);
				article.setAttribute("data-color", item.colorprod);
				section.appendChild(article);

				const divimg = document.createElement("div")
				article.appendChild(divimg);
				divimg.classList.add("cart__item__img");

				const img = document.createElement("img")
				divimg.appendChild(img).src = data.imageUrl;
				divimg.appendChild(img).alt = data.altTxt;

				const divcontent = document.createElement("div")
				divcontent.classList.add("cart__item__content");
				article.appendChild(divcontent);

				const divdescription = document.createElement("div")
				divdescription.classList.add("cart__item__content__description");
				divcontent.appendChild(divdescription);

				divdescription.appendChild(document.createElement("h2")).innerText = "Nom du produit"
				divdescription.appendChild(document.createElement("p")).innerText = item.colorprod

				const pricenv = divdescription.appendChild(document.createElement("p"))
				pricenv.classList.add('testtest')
				const divsetting = document.createElement("div")
				divsetting.classList.add("cart__item__content__setting");
				divcontent.appendChild(divsetting);

				const divquantity = document.createElement("div")
				divquantity.classList.add("cart__item__content__settings__quantity");
				divsetting.appendChild(divquantity);

				divquantity.appendChild(document.createElement("p")).innerText = "Qté : ";
				const input = divquantity.appendChild(document.createElement("input"));
				input.classList.add("itemQuantity");
				setAttributes(input, {
					"type": "number",
					"id": "quant",
					"name": "itemQuantity",
					"min": "1",
					"max": "100",
					"value": item.quantityprod
				});

				const divdelete = document.createElement("div")
				divdelete.classList.add("cart__item__content__settings__delete");
				divsetting.appendChild(divdelete);

				const btndelet = document.createElement("p")
				divdelete.appendChild(btndelet).innerText = "Supprimer";
				btndelet.classList.add("deleteItem");


				const totalPrice = document.getElementById("totalPrice");
				pricenv.innerHTML = data.price * item.quantityprod;

				// changement de quantité des produit , pris et sommes
				input.addEventListener('change', function() {
					let valueQuantity = this.value;
					pricenv.innerHTML = data.price * valueQuantity;

					changeQuantityonLocalstorage(item, valueQuantity)
					getTotalPrice();
				});

				deleted(btndelet);
				getTotalPrice();
			})
	})

}
//fonction pour utulisé plusieur setattribute dans un seul element
function setAttributes(elem, attrib) {
	for (var key in attrib) {
		elem.setAttribute(key, attrib[key]);
	}
}

// changement de quantité des produit , pris et sommes
function changeQuantityonLocalstorage(test, test2) {

	const itemIndexInBasket = basket.findIndex(basketEntry => basketEntry.idproduct == test.idproduct && basketEntry.colorprod == test.colorprod); // fonction parcours le tableau et verifie les conditions si elle n'est pas verifier il renvoi -1

	if (itemIndexInBasket !== -1) {
		basket[itemIndexInBasket].quantityprod = parseInt(test2); //si la condition est verifier la quantité doit étre accrumanté
	}
	localStorage.setItem('basket', JSON.stringify(basket));
}

// Fonction sommes total des produits
function getTotalPrice() {
	let sommeprice = 0;
	var prices = document.querySelectorAll('.testtest');

	for (i in prices) {
		if (!isNaN(prices[i].textContent)) {
			sommeprice += parseInt(prices[i].textContent)
		}
	}
	totalPrice.innerHTML = sommeprice;
}

// Supprission des produit du dom et localstorage
function deleted(itemToDelete) {
	itemToDelete.addEventListener('click', function(add) {
		const supp = itemToDelete.closest("article")
		console.log(supp)
		var index = basket.findIndex(function(o) {

			return o.idproduct == supp.getAttribute("data-id") && o.colorprod == supp.getAttribute("data-color");
		})

		if (index !== -1) {
         let text = "vous voulez supprimer l'article?";
         if (confirm(text) == true) {
            basket.splice(index, 1)
            supp.remove()
            getTotalPrice();
         } 
			
		}

		localStorage.setItem('basket', JSON.stringify(basket));
	})
}

// Verification du formulaire et recuperation des valeurs
const form = document.querySelector(".cart__order__form");
const inputorder = document.getElementById("order")

// Objet d'information de formulaire
let formulaireValue = {
	firstName: "",
	lastName: "",
	address: "",
	city: "",
	email: ""
}

// tableau de produits
const products = [];
let orderId = 0;

inputorder.addEventListener("click", (o) => {
	o.preventDefault();
	//  Recuperation des fonction regex
	let testpren = regexFirstName(form.firstName, "firstNameErrorMsg", "votre Prenom doit avoir au moins 3 carractéres et ne doit pas contenire des chiffres")
	let testname = regexLastName(form.lastName, "lastNameErrorMsg", "votre Nom doit avoir au moins 3 carractéres et ne doit pas contenire des chiffres")
	let testadress = regexAdress(form.address)
	let testcity = regexCity()
	let testmail = regexEmail()
   //  verification de validation de formulaire et envoi de commande
	if (testpren && testname && testadress && testcity && testmail) {
		sendCard()
	}
})

//fonction pour verifier le champ  prenom
function regexFirstName(valueInput, errmsg, msgerror) {

	if (valueInput.value.length == 0) {
		document.getElementById(errmsg).innerHTML = "les champs ne doit pas étre vide";

		return false
	} else if (/^([a-zA-Z ]+){3,20}$/.test(valueInput.value)) {
		document.getElementById(errmsg).innerHTML = "";
		formulaireValue.firstName = valueInput.value;
		return true;
	} else {
		document.getElementById(errmsg).innerHTML = msgerror;
		return false
	}
}

//fonction pour verifier le champ nom 
function regexLastName(valueInput, errmsg, msgerror) {

	if (valueInput.value.length == 0) {
		document.getElementById(errmsg).innerHTML = "les champs ne doit pas étre vide";
		return false
	} else if (/^([a-zA-Z ]+){3,20}$/.test(valueInput.value)) {
		document.getElementById(errmsg).innerHTML = "";
		formulaireValue.lastName = valueInput.value;
		return true;
	} else {
		document.getElementById(errmsg).innerHTML = msgerror;
		return false
	}
}

// fonction pour verifier champs adresse
function regexAdress(valueAdress) {
	if (valueAdress.value.length == 0) {
		document.getElementById("addressErrorMsg").innerHTML = "vous devez renseigner votre adresse";
		return false
	} else if (/^[0-9]/.test(valueAdress.value)) {
		document.getElementById("addressErrorMsg").innerText = "";
		formulaireValue.address = valueAdress.value;
		return true;
	} else {
		document.getElementById("addressErrorMsg").innerText = "l'adresse n'est pas valide";
		return false
	}
}

// fonction pour verifier champs ville
function regexCity() {
	if (form.city.value.length == 0) {
		document.getElementById("cityErrorMsg").innerHTML = "vous devez renseigner votre ville";
		return false
	} else if (/^([a-zA-Z]){1,}$/.test(form.city.value)) {
		document.getElementById("cityErrorMsg").innerHTML = "";
		formulaireValue.city = form.city.value
		return true;
	} else {
		document.getElementById("cityErrorMsg").innerHTML = "champs ville doit avoir au moins un caractére et ne doit pas contenire des chiffres";
		return false
	}
}

// fonction pour verifier champs email
function regexEmail() {
	if (form.email.value.length == 0) {
		document.getElementById("emailErrorMsg").innerHTML = "vous devez renseigner votre email";
		return false
	} else if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email.value)) {
		document.getElementById("emailErrorMsg").innerHTML = "";
		formulaireValue.email = form.email.value
		return true;
	} else {
		document.getElementById("emailErrorMsg").innerHTML = "vous devez inserer un mail valide";
		return false
	}
}
//  Envoie du commande au api
function sendCard() {
	//   Recuperation de tableau des produits
	for (let article of basket) {
		products.push(article.idproduct);
	}
	fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			body: JSON.stringify({
				"contact": formulaireValue,
				"products": products
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then(res => {
			return res.json();
		})
		.then((data) => {
			let orderId = data.orderId
			console.log(orderId);
			window.location.href = './confirmation.html?id=' + orderId;
			localStorage.removeItem('basket')
		})
		.catch((error) => {
			console.log(error);
		})
}