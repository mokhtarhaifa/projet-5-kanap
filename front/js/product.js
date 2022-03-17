let params = new URLSearchParams(document.location.search);
let id = params.get("product"); // recuperartion de l'id du produit sélectioné

const image = document.createElement("img");
const classimg = document.querySelector(".item__img").appendChild(image); // creation de balise img 

let selectoptions = document.getElementById("colors");
const submit = document.getElementById("addToCart");

let basket = JSON.parse(localStorage.getItem('basket')); //  recuperation du panier du localStorage s'il existe

const url = fetch("http://localhost:3000/api/products/" + id);

// Affichage des details de produit
url
  .then(response => response.json())
  .then(function(data) {
    classimg.src = data.imageUrl;
    classimg.alt = data.altTxt;
    document.getElementById("title").innerHTML = data.name;
    document.getElementById("price").innerHTML = data.price;
    document.getElementById("description").innerHTML = data.description;

    for (color in data.colors) {
      const opt = document.createElement("option");
      opt.value = data.colors[color];
      opt.innerHTML = data.colors[color];
      selectoptions.appendChild(opt);
    }
  })
  .catch(function(err) {
    console.log("ereur d'affichage")
  })

// ecouter l'evenement on click 
submit.addEventListener('click', function(add) {

  let idproduct = id;

  //récuperation des valeurs couleur et quantité en click
  let quantityprod = document.getElementById("quantity").value;
  let colorprod = document.getElementById("colors").value;

  //appel de fonction de verification de choix
  verifychoice();

  //verifictation de couleur de produit si il posséde le méme id
  const itemIndexInBasket = basket.findIndex(basketEntry => basketEntry.idproduct == idproduct && basketEntry.colorprod == colorprod); // fonction parcourir le tableau et verifie les conditions si elle n'est pas verifier il renvoi -1
  if (itemIndexInBasket !== -1) {
    basket[itemIndexInBasket].quantityprod = parseInt(basket[itemIndexInBasket].quantityprod) + parseInt(quantityprod); //si la condition est vérifié la quantité doit étre accrumanté
    msgadd() //appel de fonction msg d'ajout
  } else if (quantityprod != 0 && colorprod != 0) {
    basket.push({
      idproduct,
      colorprod,
      quantityprod
    }); //si non on doit ajouter un objet qui contient les valeurs
    msgadd()
  }
  localStorage.setItem('basket', JSON.stringify(basket));
});

// verifier si l'utilisateur à bien choisit la couleur et la quantité du produit
function verifychoice() {

  if ((document.getElementById("quantity").value == 0) && (document.getElementById("colors").value == 0)) {
    alert("ajouter quantité et couleur")
  } else if (document.getElementById("quantity").value == 0) {
    alert("ajouter quantité")
  } else if (document.getElementById("colors").value == 0) {
    alert("ajouter couleur")
  } //verifier si les champs ne sont pas vide
  else if (!basket) {
    basket = [];

  } // si basket est null creer un tableau
}

// message de confirmation d'ajout au panier
function msgadd() {
  const msg = document.createElement("p");
  document.querySelector(".item__content").appendChild(msg);
  msg.innerText = "Votre produit a été ajouter au panier"
  msg.style.color = "#0A3B4D"
  msg.style.fontSize = '16px'
  msg.style.fontWeight = 'bold'
  msg.style.textAlign = "center"
}