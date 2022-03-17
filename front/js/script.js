const url = fetch("http://localhost:3000/api/products");
    url
	.then(response => response.json())
	.then(function(data) {
		for (obj of data) {
			const linkproduct = document.createElement("a");
			const article = document.createElement("article");
			linkproduct.appendChild(article);

			const imgproduct = document.createElement("img");
			const nom = document.createElement("h3");
			nom.classList.add("productName");
			const description = document.createElement("p");
			description.classList.add("productDescription");

			article.appendChild(imgproduct).src = obj.imageUrl;
			article.appendChild(imgproduct).alt = obj.altTxt;
			article.appendChild(nom).innerHTML = obj.name;
			article.appendChild(description).innerHTML = obj.description;

			const items = document.getElementById("items");
			items.appendChild(linkproduct).href = "./product.html?product=" + obj._id;
		}
	})
	.catch(function(err) {
		alert("les produits ne sont pas dispnible");
	})