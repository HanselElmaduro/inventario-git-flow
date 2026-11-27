"use strict";

const STORAGE_KEY = "inventario-productos-v1";
const form = document.querySelector("#product-form");
const tableBody = document.querySelector("#products");
const currency = new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP" });
const formTitle = document.querySelector("#form-title");
const submitButton = document.querySelector("#save-product");
const cancelEdit = document.querySelector("#cancel-edit");
let editingCode = null;
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
    cell.colSpan = 6;
    cell.className = "empty";
    cell.textContent = products === null ? "Inventario no disponible." : "Todavía no hay productos.";
    return;
  }
  for (const product of products) {
    const row = tableBody.insertRow();
    for (const value of [product.code, product.name, product.category, product.quantity, currency.format(product.price)]) {
      row.insertCell().textContent = value;
    }
    const actions = row.insertCell();
    actions.append(productAction("Editar", "secondary", product, () => editProduct(product)));
  }
}

function productAction(label, style, product, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = style;
  button.textContent = label;
  button.setAttribute("aria-label", label + " " + product.name);
  button.addEventListener("click", onClick);
  return button;
}

function editProduct(product) {
  editingCode = product.code;
  for (const [name, value] of Object.entries(product)) {
    form.elements.namedItem(name).value = value;
  }
  formTitle.textContent = "Editar producto";
  submitButton.textContent = "Guardar cambios";
  cancelEdit.hidden = false;
  showNotice("");
  form.elements.namedItem("code").focus();
}

function resetForm() {
  editingCode = null;
  form.reset();
  formTitle.textContent = "Registrar producto";
  submitButton.textContent = "Guardar producto";
  cancelEdit.hidden = true;
}

cancelEdit.addEventListener("click", () => {
  resetForm();
  showNotice("");
  form.elements.namedItem("code").focus();
});

function storeProduct(product) {
  if (products.some((item) => item.code === product.code && item.code !== editingCode)) {
    showNotice("Ya existe un producto con ese código.", true);
    return;
  }
  const isEditing = editingCode !== null;
  const updatedProducts = isEditing
    ? products.map((item) => item.code === editingCode ? product : item)
    : [...products, product];
  if (saveProducts(updatedProducts)) {
    resetForm();
    renderProducts();
    showNotice(isEditing ? "Producto actualizado." : "Producto registrado.");
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
  storeProduct(product);
});

renderProducts();
