let basket = JSON.parse(localStorage.getItem('basket'));
if(basket){
    let price = 0;
    const section = document.getElementById("cart__items")
    basket.forEach(function (item, index) {
        
   //   creation des attribut HTML
        const url = fetch("http://localhost:3000/api/products/"+item.idproduct);
        url
        .then(response => response.json())
        .then(function (data){
            const article = document.createElement("article");
            article.classList.add("cart__item");
            article.setAttribute("data-id", item.idproduct);
            article.setAttribute("data-color", item.colorprod);
            section.appendChild(article);


            const divimg = document.createElement("div")
            article.appendChild(divimg);
            divimg.classList.add("cart__item__img");
            
            const img=document.createElement("img")
            divimg.appendChild(img).src = data.imageUrl;
            divimg.appendChild(img).alt = "Photographie d'un canapé";
            

            const divcontent = document.createElement("div")
            divcontent.classList.add("cart__item__content");
            article.appendChild(divcontent);
            

            const divdescription = document.createElement("div")
            divdescription.classList.add("cart__item__content__description");
            divcontent.appendChild(divdescription);
            

            divdescription.appendChild(document.createElement("h2")).innerText="Nom du produit"
            divdescription.appendChild(document.createElement("p")).innerText=item.colorprod
            const pricenv = divdescription.appendChild(document.createElement("p"))
            pricenv.classList.add('testtest')
            const divsetting = document.createElement("div")
            divsetting.classList.add("cart__item__content__setting");
            divcontent.appendChild(divsetting);

            const divquantity = document.createElement("div")
            divquantity.classList.add("cart__item__content__settings__quantity");
            divsetting.appendChild(divquantity);

            divquantity.appendChild(document.createElement("p")).innerText="Qté : ";
            const input = divquantity.appendChild(document.createElement("input"));
            input.setAttribute("type", "number")
            input.classList.add("itemQuantity");
            input.setAttribute("id", "quant")
            input.setAttribute("name", "itemQuantity")
            input.setAttribute("min", "1")
            input.setAttribute("max", "100")
            input.setAttribute("value",item.quantityprod)

            const divdelete = document.createElement("div")
            divdelete.classList.add("cart__item__content__settings__delete");
            divsetting.appendChild(divdelete);

            const p =document.createElement("p")
            divdelete.appendChild(p).innerText="Supprimer";
            p.classList.add("deleteItem");
            const totalPrice = document.getElementById("totalPrice");
            pricenv.innerHTML= data.price * item.quantityprod;
           
            
   // changement de quantité des produit , pris et sommes
            input.addEventListener('change', function () {
                let valueQuantity = this.value;
                pricenv.innerHTML = data.price * valueQuantity ;
                const itemIndexInBasket = basket.findIndex(basketEntry => basketEntry.idproduct == item.idproduct && basketEntry.colorprod == item.colorprod); // fonction parcours le tableau et verifie les conditions si elle n'est pas verifier il renvoi -1
                
                if (itemIndexInBasket !== -1) {
                    basket[itemIndexInBasket].quantityprod = parseInt(valueQuantity);//si la condition est verifier la quantité doit étre accrumanté
                } 
                localStorage.setItem('basket', JSON.stringify(basket));

                getTotalPrice();
            });

            getTotalPrice();


   // Supprission des produit du dom et localstorage
            p.addEventListener('click', function (add){
                const supp = p.closest("article")

                var index = basket.findIndex(function(o){
                    return o.idproduct == supp.getAttribute("data-id") && o.colorprod == supp.getAttribute("data-color");
                })
                
                if (index !== -1) {
                    basket.splice(index, 1)
                    supp.remove()
                }

                localStorage.setItem('basket', JSON.stringify(basket));
            })
        });
    });
}


   // Fonction sommes
function getTotalPrice(){
    let ss = 0;
    var prices = document.querySelectorAll('.testtest');
                
    for( i in prices) {
        if (!isNaN(prices[i].textContent)) {

            ss += parseInt(prices[i].textContent)
        }
    }
                
    totalPrice.innerHTML = ss;
}

// Verification du formulaire et recuperation des valeurs
const form = document.querySelector(".cart__order__form");
const inputorder =document.getElementById("order")

// Objet d'information de formulaire
let formulairevalue = {
   prenom : "" ,
   nom :  "",
   adresse :  "",
   ville:  "",
   email: ""
}

// tableau de produits
const products = [];

inputorder.addEventListener("click", (o) => {
   o.preventDefault();
   console.log(form.firstName.value)
     if(/^([a-zA-Z ]+){3,20}$/.test(form.firstName.value)){
        document.getElementById("firstNameErrorMsg").innerHTML = "";
        formulairevalue.prenom = form.firstName.value;
     }
     else{
        document.getElementById("firstNameErrorMsg").innerHTML = "prenom doit avoir au moins 3 carractéres et ne doit pas contenire des chiffres";
     }
     
     if(/^([a-zA-Z]){3,20}$/.test(form.lastName.value)){
        document.getElementById("lastNameErrorMsg").innerHTML = "";
        formulairevalue.nom = form.lastName.value;
     }
     else{
        document.getElementById("lastNameErrorMsg").innerHTML = "nom ne doit pas contenire un espace et doit étre au moins compposé de 3 caractére";
     }

     if(/^[0-9]/.test(form.address.value)){
        document.getElementById("addressErrorMsg").innerText = "";
        formulairevalue.adresse = form.address.value;
     }
     else{
        document.getElementById("addressErrorMsg").innerText = "l'adresse n'est pas valide";
     }


     if(/^([a-zA-Z]){1,}$/.test(form.city.value)){
        document.getElementById("cityErrorMsg").innerHTML = "";
        formulairevalue.ville = form.city.value
     }
     else{
        document.getElementById("cityErrorMsg").innerHTML = "min 1 carractére";
     }

     if(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(form.email.value)){
        document.getElementById("emailErrorMsg").innerHTML = "";
        formulairevalue.email = form.email.value
     }
     else{
        document.getElementById("emailErrorMsg").innerHTML = "mail invalide";
     }

     
     
   //   Recuperation des valeur de tableau produit
     for (let article of basket) {
      products.push(article.idproduct);
    }



   //  Envoie du commande au api
    console.log('pro ' + products)
     console.log('formulairevalue ' + JSON.stringify(formulairevalue))
     const aa = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      
      body: JSON.stringify({formulairevalue, products}),
      headers: {
         "Content-Type": "application/json",
       },
    })
       
      .then(function (response) {
         console.log(response);
        return response;

        
      })
      .then(function (data) {
        orderId = data.orderId;
      });

}) 

