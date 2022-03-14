
let params = new URLSearchParams(document.location.search);
let id = params.get("product"); 

const url = fetch("http://localhost:3000/api/products/"+id);
url
.then(response => response.json())
.then(function (data){
    
    const image = document.createElement("img");
    const classimg = document.querySelector(".item__img").appendChild(image);
    classimg.src = data.imageUrl;
    classimg.alt = data.altTxt;
    document.getElementById("title").innerHTML= data.name;
    document.getElementById("price").innerHTML= data.price;
    document.getElementById("description").innerHTML= data.description;

    let selectoptions = document.getElementById("colors");
    for(color in data.colors){
        const opt = document.createElement("option");
        opt.value = data.colors[color];
        opt.innerHTML = data.colors[color];
        selectoptions.appendChild(opt);
    }

});

const submit =  document.getElementById("addToCart");

  submit.addEventListener('click', function (add) {  
       
   let basket = JSON.parse(localStorage.getItem('basket'));  // recupére le tableau du basket si il contenu des éléments
                     
    let idproduct = id;                                
    let quantityprod = document.getElementById("quantity").value;                           
    let colorprod = document.getElementById("colors").value; 

    if(quantityprod == 0 && colorprod == 0 ){
      alert ("ajouter quantité et couleur")
    }
    else if(quantityprod == 0){
      alert ("ajouter quantité")
    }
    else if(colorprod == 0) {
      alert ("ajouter couleur")
    }//verifier si les champs ne sont pas vide
  
   else{
    if (!basket) {
      basket = [];
    }// si basket est null creer un tableau
   }
  
    
    const itemIndexInBasket = basket.findIndex(basketEntry => basketEntry.idproduct == idproduct && basketEntry.colorprod == colorprod); // fonction parcours le tableau et verifie les conditions si elle n'est pas verifier il renvoi -1
    if (itemIndexInBasket !== -1) {
      basket[itemIndexInBasket].quantityprod = parseInt(basket[itemIndexInBasket].quantityprod) + parseInt(quantityprod);//si la condition est verifier la quantité doit étre accrumanté
     
    } 
  else if(quantityprod != 0 && colorprod != 0 ) {
      basket.push({idproduct, colorprod, quantityprod});  //si non on doit ajouter un objet qui contient les valeurs
      
    } 
    
    localStorage.setItem('basket', JSON.stringify(basket));
    
    

   });


   //location.href='./cart.html';