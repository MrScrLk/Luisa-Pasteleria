const WHATSAPP_NUMBER = "54911XXXXXXXX"; // Ej: Argentina +54 9 11 ... => "54911..."
const INSTAGRAM_URL = "https://www.instagram.com/tu_cuenta/"; // Cambiar a la cuenta real

/* ============================
   Helpers
   ============================ */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function moneyARS(n){
  try {
    return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString("es-AR")}`;
  }
}
function safeNumber(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/* ============================
   Mobile nav
   ============================ */
const hamburgerBtn = $("#hamburgerBtn");
const mobileNav = $("#mobileNav");
if (hamburgerBtn && mobileNav){
  hamburgerBtn.addEventListener("click", () => {
    mobileNav.classList.toggle("is-open");
  });
  $$(".mobileNav__link", mobileNav).forEach(a => {
    a.addEventListener("click", () => mobileNav.classList.remove("is-open"));
  });
}

/* ============================
   Instagram links
   ============================ */
["igFab","contactIgLink","footerIgLink"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = INSTAGRAM_URL;
});

/* ============================
   Back to top
   ============================ */
const backToTopBtn = $("#backToTopBtn");
window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;
  const show = window.scrollY > 500;
  backToTopBtn.classList.toggle("is-visible", show);
});
if (backToTopBtn){
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================
   Product modal
   ============================ */
const productModal = $("#productModal");
const modalMainImg = $("#modalMainImg");
const modalThumbs = $("#modalThumbs");
const modalTitle = $("#modalTitle");
const modalCategory = $("#modalCategory");
const modalPrice = $("#modalPrice");
const modalAddBtn = $("#modalAddBtn");
const modalGoCartBtn = $("#modalGoCartBtn");

let modalCurrentProduct = null;

function openModal(productEl){
  modalCurrentProduct = productEl;
  const name = productEl.dataset.name || "Producto";
  const category = productEl.dataset.category || "Categoría";
  const price = safeNumber(productEl.dataset.price || 0);
  const mainImg = productEl.dataset.img || "";
  const gallery = (productEl.dataset.gallery || mainImg).split("|").filter(Boolean);

  modalTitle.textContent = name;
  modalCategory.textContent = category;
  modalPrice.textContent = moneyARS(price);
  modalMainImg.src = mainImg;
  modalMainImg.alt = name;

  modalThumbs.innerHTML = "";
  gallery.forEach((src, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb" + (idx === 0 ? " is-active" : "");
    btn.innerHTML = `<img src="${src}" alt="Vista ${idx+1} de ${name}" loading="lazy">`;
    btn.addEventListener("click", () => {
      modalMainImg.src = src;
      $$(".thumb", modalThumbs).forEach(t => t.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
    modalThumbs.appendChild(btn);
  });

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeModal(){
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  if (!cartDrawer?.classList.contains("is-open")) {
  document.body.classList.remove("no-scroll");
}
  modalCurrentProduct = null;
}

if (productModal){
  productModal.addEventListener("click", (e) => {
    const closeEl = e.target.closest('[data-close="true"]');
    if (closeEl) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && productModal.classList.contains("is-open")) closeModal();
  });
}

if (modalAddBtn){
  modalAddBtn.addEventListener("click", () => {
    if (!modalCurrentProduct) return;
    addToCartFromElement(modalCurrentProduct);
    openCart();
  });
}
if (modalGoCartBtn){
  modalGoCartBtn.addEventListener("click", () => {
    closeModal();
    openCart();
  });
}

/* ============================
   Catalog interactions
   ============================ */
const catalogGrid = $("#catalogGrid");
const featuredGrid = $("#featuredGrid");

function bindProductGrid(gridEl){
  if (!gridEl) return;

  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const productEl = btn.closest(".product");
    if (!productEl) return;

    if (btn.classList.contains("js-add")){
      addToCartFromElement(productEl);
      return;
    }
    if (btn.classList.contains("js-view")){
      openModal(productEl);
      return;
    }
  });
}
bindProductGrid(catalogGrid);
bindProductGrid(featuredGrid);

/* ============================
   Search / filter / sort
   ============================ */
const searchInput = $("#searchInput");
const categorySelect = $("#categorySelect");
const sortSelect = $("#sortSelect");

function getAllCatalogProducts(){
  return $$(".product", catalogGrid);
}

function applyCatalog(){
  const q = (searchInput?.value || "").trim().toLowerCase();
  const cat = categorySelect?.value || "Todas";
  const sort = sortSelect?.value || "recomendado";

  const items = getAllCatalogProducts();

  // filter visibility
  items.forEach(el => {
    const name = (el.dataset.name || "").toLowerCase();
    const category = el.dataset.category || "";
    const matchesQuery = q === "" || name.includes(q);
    const matchesCat = cat === "Todas" || category === cat;
    el.style.display = (matchesQuery && matchesCat) ? "" : "none";
  });

  // sort (only visible ones)
  const visible = items.filter(el => el.style.display !== "none");
  const sorted = [...visible];

  if (sort === "precio-asc"){
    sorted.sort((a,b) => safeNumber(a.dataset.price) - safeNumber(b.dataset.price));
  } else if (sort === "precio-desc"){
    sorted.sort((a,b) => safeNumber(b.dataset.price) - safeNumber(a.dataset.price));
  } else if (sort === "nombre-asc"){
    sorted.sort((a,b) => (a.dataset.name||"").localeCompare((b.dataset.name||""), "es"));
  } else {
    // recomendado: no tocar orden
    return;
  }

  sorted.forEach(el => catalogGrid.appendChild(el));
}

[searchInput, categorySelect, sortSelect].forEach(el => {
  if (!el) return;
  el.addEventListener("input", applyCatalog);
  el.addEventListener("change", applyCatalog);
});

/* ============================
   Cart
   ============================ */
const CART_KEY = "luisaPasteleriaCart_v1";
const cartDrawer = $("#cartDrawer");
const cartList = $("#cartList");
const cartCount = $("#cartCount");
const cartTotal = $("#cartTotal");
const notesInput = $("#notesInput");

const openCartBtn = $("#openCartBtn");
const sendWspBtn = $("#sendWspBtn");
const clearCartBtn = $("#clearCartBtn");

const heroWspBtn = $("#heroWspBtn");
const contactWspBtn = $("#contactWspBtn");

let cart = loadCart();

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: {}, notes: "" };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { items: {}, notes: "" };
    return {
      items: parsed.items || {},
      notes: typeof parsed.notes === "string" ? parsed.notes : ""
    };
  } catch {
    return { items: {}, notes: "" };
  }
}
function saveCart(){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function cartItemsArray(){
  return Object.values(cart.items);
}

function addToCartFromElement(productEl){
  const sku = productEl.dataset.sku;
  const name = productEl.dataset.name || "Producto";
  const price = safeNumber(productEl.dataset.price || 0);
  const img = productEl.dataset.img || "";

  if (!sku) return;

  if (!cart.items[sku]){
    cart.items[sku] = { sku, name, price, img, qty: 1 };
  } else {
    cart.items[sku].qty += 1;
  }

  saveCart();
  renderCart();
  toast(`Agregado: ${name}`);
}

function removeFromCart(sku){
  delete cart.items[sku];
  saveCart();
  renderCart();
}
function changeQty(sku, delta){
  if (!cart.items[sku]) return;
  cart.items[sku].qty += delta;
  if (cart.items[sku].qty <= 0) delete cart.items[sku];
  saveCart();
  renderCart();
}
function clearCart(){
  cart = { items: {}, notes: cart.notes || "" };
  saveCart();
  renderCart();
}

function cartTotalValue(){
  return cartItemsArray().reduce((acc, it) => acc + (it.price * it.qty), 0);
}
function cartCountValue(){
  return cartItemsArray().reduce((acc, it) => acc + it.qty, 0);
}

function renderCart(){
  if (cartCount) cartCount.textContent = String(cartCountValue());
  if (notesInput) notesInput.value = cart.notes || "";

  if (!cartList || !cartTotal) return;

  const items = cartItemsArray();
  cartList.innerHTML = "";

  if (items.length === 0){
    cartList.innerHTML = `
      <div class="empty">
        <p style="margin:0; color: rgba(22,22,22,.7); line-height:1.6;">
          Tu carrito está vacío. Volvé al catálogo y agregá productos.
        </p>
      </div>
    `;
  } else {
    items.forEach(it => {
      const row = document.createElement("div");
      row.className = "cartItem";
      row.innerHTML = `
        <img class="cartItem__img" src="${it.img}" alt="${it.name}" loading="lazy" />
        <div>
          <p class="cartItem__name">${it.name}</p>
          <div class="cartItem__meta">
            <span>${moneyARS(it.price)} c/u</span>
            <button class="cartItem__remove" type="button" data-remove="${it.sku}">Eliminar</button>
          </div>

          <div class="qty" aria-label="Cantidad">
            <button type="button" data-qty="${it.sku}" data-delta="-1" aria-label="Restar">−</button>
            <span>${it.qty}</span>
            <button type="button" data-qty="${it.sku}" data-delta="1" aria-label="Sumar">+</button>
          </div>
        </div>
      `;
      cartList.appendChild(row);
    });
  }

  cartTotal.textContent = moneyARS(cartTotalValue());
}

function openCart(){
  if (!cartDrawer) return;
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}
function closeCart(){
  if (!cartDrawer) return;
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  if (!productModal?.classList.contains("is-open")) {
  document.body.classList.remove("no-scroll");
}
}

if (openCartBtn) openCartBtn.addEventListener("click", openCart);

if (cartDrawer){
  cartDrawer.addEventListener("click", (e) => {
    const t = e.target;

    const closeEl = t.closest('[data-close-cart="true"]');
    if (closeEl){
      closeCart();
      return;
    }

    const removeSku = t?.dataset?.remove;
    if (removeSku){
      removeFromCart(removeSku);
      return;
    }

    const qtySku = t?.dataset?.qty;
    const delta = safeNumber(t?.dataset?.delta);
    if (qtySku && delta){
      changeQty(qtySku, delta);
      return;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartDrawer.classList.contains("is-open")) closeCart();
  });
}

if (notesInput){
  notesInput.addEventListener("input", () => {
    cart.notes = notesInput.value;
    saveCart();
  });
}
if (clearCartBtn){
  clearCartBtn.addEventListener("click", () => {
    clearCart();
    toast("Carrito vaciado");
  });
}

/* ============================
   WhatsApp order
   ============================ */
function buildOrderMessage(){
  const items = cartItemsArray();
  const notes = (cart.notes || "").trim();

  if (items.length === 0){
    return "Hola! Quiero consultar por productos de Luisa Pastelería 🙂";
  }

  const lines = [];
  lines.push("Hola! Quiero hacer un pedido en Luisa Pastelería:");
  lines.push("");
  items.forEach(it => {
    lines.push(`• ${it.qty} x ${it.name} — ${moneyARS(it.price * it.qty)}`);
  });
  lines.push("");
  lines.push(`Total estimado: ${moneyARS(cartTotalValue())}`);

  if (notes){
    lines.push("");
    lines.push("Notas:");
    lines.push(notes);
  }

  lines.push("");
  lines.push("¿Me confirmás disponibilidad y fecha, por favor?");
  return lines.join("\n");
}

function openWhatsAppWithMessage(message){
  const cleanNumber = (WHATSAPP_NUMBER || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);

  // wa.me works on mobile & desktop
  const url = cleanNumber
    ? `https://wa.me/${cleanNumber}?text=${text}`
    : `https://wa.me/?text=${text}`;

  window.open(url, "_blank", "noopener,noreferrer");
}

if (sendWspBtn){
  sendWspBtn.addEventListener("click", () => {
    const msg = buildOrderMessage();
    openWhatsAppWithMessage(msg);
  });
}

function quickWsp(){
  const msg = "Hola! Quiero consultar por productos y disponibilidad en Luisa Pastelería.";
  openWhatsAppWithMessage(msg);
}
if (heroWspBtn) heroWspBtn.addEventListener("click", quickWsp);
if (contactWspBtn) contactWspBtn.addEventListener("click", quickWsp);

/* ============================
   Mini toast
   ============================ */
let toastTimer = null;
function toast(text){
  let el = document.getElementById("toast");
  if (!el){
    el = document.createElement("div");
    el.id = "toast";
    el.style.position = "fixed";
    el.style.left = "50%";
    el.style.bottom = "18px";
    el.style.transform = "translateX(-50%)";
    el.style.padding = "10px 14px";
    el.style.borderRadius = "999px";
    el.style.border = "1px solid rgba(0,0,0,.22)";
    el.style.background = "rgba(255,255,255,.92)";
    el.style.boxShadow = "0 18px 40px rgba(22,22,22,.14)";
    el.style.fontWeight = "800";
    el.style.zIndex = "120";
    el.style.opacity = "0";
    el.style.transition = "opacity .2s ease, transform .2s ease";
    el.style.transform = "translateX(-50%) translateY(6px)";
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(0)";

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(6px)";
  }, 1400);
}

/* ============================
   Init
   ============================ */
renderCart();
applyCatalog();
