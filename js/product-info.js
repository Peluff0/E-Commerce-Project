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
function showProduct(product) {
  containerProduct.innerHTML = `
    <div class="row mb-2">
      <h1 class="border-bottom border-2 pt-5 pb-5 h2">${product.name}</h1>
    </div>
    <div class="row">
      <div class="mb-4">
        <h6 class="mb-0"><b>Precio</b></h6>
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
      <div class="mb-2">
        <h6 class="mb-2"><b>Imágenes ilustrativas</b></h6>
        ${generateImageCarousel(product.images)}
      </div>
    </div>
  `;
}

// Función para crear el carrusel de imágenes
function generateImageCarousel(images) {
  // Verifica si no se proporcionaron imágenes o si el arreglo está vacío
  if (!images || images.length === 0) {
    return ''; // Retorna una cadena vacía si no hay imágenes
  }

  // Genera los indicadores del posición dentro del carrusel
  const carouselIndicators = images.map((image, i) => `
    <button
      type="button"
      data-bs-target="#productImageCarousel"
      data-bs-slide-to="${i}"
      class="${i === 0 ? 'active' : ''}"
      aria-current="${i === 0 ? 'true' : 'false'}"
      aria-label="Slide ${i + 1}"
    ></button>`).join('');

  // Genera el contenido dentro del carrusel
  const carouselInner = images.map((image, i) => `
    <div class="carousel-item ${i === 0 ? 'active' : ''}">
      <img src="${image}" class="d-block w-100" alt="Image ${i + 1}">
    </div>`).join('');

  // Retorna el carrusel completo en forma de cadena HTML
  return `
    <div id="productImageCarousel" class="carousel carousel-dark slide carousel-fade" data-bs-ride="carousel" style="max-width: 50rem;">
      <ol class="carousel-indicators">${carouselIndicators}</ol>
      <div class="carousel-inner">${carouselInner}</div>
      <a class="carousel-control-prev" href="#productImageCarousel" role="button" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </a>
      <a class="carousel-control-next" href="#productImageCarousel" role="button" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </a>
    </div>`;
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
//A partir de acá se puede borrar/cambiar todo.
//Función asíncrona que muestra las cards de los productos relacionados, utilizando el endpoint de los productos.
//Código empleado: desde 165 hasta 205.
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
//Función para pushear el id del producto al localStorage y redirigir a su respectiva página. (se usa con un onclick linea 199)
function setProductID(id) {      
  localStorage.setItem("productID", id);
  window.location = "product-info.html"
}
//Función que genera números aleatorios para ser usados como indice del array de productos.
function indexGenerator(products){
  let indexProduct;
  let arrayLength = products.length;
  for (const iterator in products) {
    if (products[iterator].id == productID) {
      indexProduct = iterator;
      break;
    }
  }

  let numero1, numero2;
  do {
    numero1 = Math.floor(Math.random() * arrayLength); 
    numero2 = Math.floor(Math.random() * arrayLength);
  } while (numero1 === numero2 || numero1 == indexProduct || numero2 == indexProduct);

  return [numero1, numero2];
} 
//Función que genera las cards con los producto relacionados.
function showRelatedProducts(products){
  let relatedProduct = '';
  for (const i of indexGenerator(products)) {
    relatedProduct += `
    <div class="col-6 col-md-4 col-lg-3 cursor-active" onclick="setProductID(${products[i].id})">
      <div class="card">
        <img src="${products[i].image}" class="card-img-top" alt="...">
        <div class="card-body">
          <h6 class="card-title">${products[i].name}</h6>
        </div>
      </div>
    </div>
    `
  }
  return document.getElementById('containerRelatedProducts').innerHTML += relatedProduct;
}