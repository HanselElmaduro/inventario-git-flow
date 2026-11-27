"use strict";

const STORAGE_KEY = "inventario-productos-v1";
const form = document.querySelector("#product-form");
const tableBody = document.querySelector("#products");
const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" });
const notice = document.querySelector("#notice");

let products;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  products = saved === null ? [] : JSON.parse(saved);
  if (!Array.isArray(products)) throw new Error("Formato inválido");
} catch {
  products = null;
  showNotice("No se pudo leer el inventario guardado en este navegador.", true);
}

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle("error", isError);
}

function saveProducts(updatedProducts) {
  if (products === null) {
    showNotice("El inventario no está disponible.", true);
    return false;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProducts));
  } catch {
    showNotice("No se pudieron guardar los cambios en este navegador.", true);
    return false;
  }
  products = updatedProducts;
  return true;
}

function renderProducts() {
  tableBody.replaceChildren();
  if (!products?.length) {
    const cell = tableBody.insertRow().insertCell();
    cell.colSpan = 5;
    cell.className = "empty";
    cell.textContent = products === null ? "Inventario no disponible." : "Todavía no hay productos.";
    return;
  }
  for (const product of products) {
    const row = tableBody.insertRow();
    for (const value of [product.code, product.name, product.category, product.quantity, currency.format(product.price)]) {
      row.insertCell().textContent = value;
    }
  }
}

function readProduct() {
  const fields = new FormData(form);
  const code = fields.get("code").trim().toUpperCase();
  const name = fields.get("name").trim();
  const category = fields.get("category").trim();
  if (!code || !name || !category) return null;
  return {
    code,
    name,
    category,
    quantity: Number(fields.get("quantity")),
    price: Number(fields.get("price"))
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (products === null) return;
  const product = readProduct();
  if (!product) {
    showNotice("Completa el código, el nombre y la categoría.", true);
    return;
  }
  if (products.some((item) => item.code === product.code)) {
    showNotice("Ya existe un producto con ese código.", true);
    return;
  }
  if (saveProducts([...products, product])) {
    form.reset();
    renderProducts();
    showNotice("Producto registrado.");
  }
});

renderProducts();
