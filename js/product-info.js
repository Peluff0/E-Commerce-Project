const productID = localStorage.getItem("productID");
const API_URL = `https://japceibal.github.io/emercado-api/products/${productID}.json`;
const API_URL_COMMENTS = `https://japceibal.github.io/emercado-api/products_comments/${productID}.json`;
const catID = localStorage.getItem("catID");
const API_URL_PRODUCTS = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;
const containerProduct = document.getElementById("containerProductInfo");
const containerComments = document.getElementById("containerComments");
const btnSend = document.getElementById("btnSend");

//Escuchamos el evento DOMContentLoaded para recién ahí, llamar a las funciones que muestran los productos y comentarios.
document.addEventListener("DOMContentLoaded", () => {
    getAndShowProductsInfo(API_URL);
    getAndShowRelationProducts(API_URL_PRODUCTS);
    getAndShowComments(API_URL_COMMENTS);
})
//Función asíncrona que muestra la card generada del producto, utilizando el endpoint del producto pertinente.
//Código empleado: desde 30 hasta 94.
async function getAndShowProductsInfo(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Hubo un problema con la solicitud: ${response.status}`);
        }
        const data = await response.json();
        showProduct(data);
    } catch (error) {
        console.log(error);
    }
}
//Función que genera la "card"(no es una card xd) del producto.
//Desde la linea 56 hasta la 66 es del carousel. (Se puede borrar/cambiar). Lineas: 56 - 66.
function showProduct(product){
containerProduct.innerHTML = ` 
<div class="row mb-2">
  <h1 class="border-bottom border-2 pt-5 pb-5 h2">${product.name}</h1>
</div>
<div class="row">
  <div class="mb-4">
    <h6 class="mb-0" class="mb-0"><b>Precio</b></h6>
    <small>${product.currency} ${product.cost}</small>
  </div>
  <div class="mb-4">
    <h6 class="mb-0"><b>Descripción</b></h6>
    <small>${product.description}</small>
  </div>
  <div class="mb-4">
    <h6 class="mb-0"><b>Categoría</b></h6>
    <small>${product.category}</small>
  </div>
  <div class="mb-4">
    <h6 class="mb-0"><b>Cantidad vendidos</b></h6>
    <small>${product.soldCount}</small>
  </div>
  <div>
    <h6 class="mb-2"><b>Imágenes ilustrativas</b></h6>
    <div id="carouselExampleFade" class="carousel slide carousel-fade col-12 col-md-9 col-lg-6">
      <div class="carousel-inner">${showImages(product.images)}</div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</div>
    `
}
//Función que genera las cards de las imágenes para el carousel.
function showImages(images) {
    let cont = 0;
    let img = "";
    //Genero la primer imágen con la class "active".
    //Esto es del carousel (Se puede borrar/cambiar).
    for (const image of images) {
      if(cont === 0){
        img += `
        <div class="carousel-item active">
          <img src="${image}" class="d-block w-100" alt="...">
        </div>
        `
        cont++
      }else {//Genero el resto de imágenes sin la class "active".
        img += `
        <div class="carousel-item">
          <img src="${image}" class="d-block w-100" alt="...">
        </div>
        `
      }
    }
    return img;
}
//Función asíncrona que muestra los comentarios generados, utilizando el endpoint de los comentarios.
//Código empleado: desde 109 hasta 154. 
async function getAndShowComments(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Hubo un problema con la solicitud: ${response.status}`);
      }
      const data = await response.json();
      showComments(data);
  } catch (error) {
      console.log(error);
  }
}
//Función que genera las cards con los producto comentarios.
function showComments(comments) {
  let currentDate = new Date().toLocaleString();

  for (const comment of comments) {
  containerComments.innerHTML += ` 
  <div class="media-body border border-2 px-3 py-2"> 
    <div class="d-flex align-items-center">
      <p class="mb-0"><strong> ${comment.user} </strong> - <small> ${currentDate}</small> - ${showStars(comment.score)} </p>
    </div>
    <p class="mb-0"> ${comment.description} </p>
  </div>
  `
  }
}
//Función para agregar nuevos comentarios.
function addComment() {
  const comment = document.getElementById("comment");
  const commentText = comment.value.trim();
  console.log(commentText);
  const selectedRating = document.getElementById("options").value;
  //Verifico que exista texto en el textarea.
  if (commentText) {
    const newComment = [{
      user: JSON.parse(localStorage.getItem('datosUsuario')).username,
      score: selectedRating,
      description: commentText
    }];
    comment.value = '';
    showComments(newComment);
  }
}
btnSend.addEventListener("click", addComment);
//Función que genera las estrellas para los comentarios.
function showStars(quantity){
  let stars = "";

  for (let i = 0; i < quantity; i++) {
    stars += `<span class="fa fa-star checked"></span>`;
  }

  for (let i = quantity; i < 5; i++) {
    stars += `<span class="fa fa-star"></span>`;
  }
  return stars;
}





async function getAndShowRelationProducts(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Hubo un problema con la solicitud: ${response.status}`);
      }
      const data = await response.json();
      showRelatedProducts(data.products);
     

    
  } catch (error) {
      console.log(error);
  }
}
//Función para pushear el id del producto al localStorage 
function setProductID(id) {      
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}

//Función productos relacionados
function showRelatedProducts(products){
  let contador = 0;
        for (let i = 0; i < products.length; i++) {
            if (productID != products[i].id && contador < 2){ 
            document.getElementById("containerRelatedProducts").innerHTML += `
            <div class="col-6 col-md-4 col-lg-3 cursor-active">
            <div class="card">
            <img src="${products[i].image}" class="card-img-top" alt="..." onclick = "setProductID(${products[i].id})">
           <div class="card-body">
            <h6 class="card-title">${products[i].name}</h6>
              </div>
           </div>
           </div>` 
           contador++;
          }
      }
}