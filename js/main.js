/* ============================
   CONFIG
============================ */
const WHATSAPP_NUMBER = "54911XXXXXXXX"; // Ej: "549351XXXXXXX" o "54911...." (solo números)
const INSTAGRAM_URL = "https://www.instagram.com/tu_cuenta/";

/* ============================
   PRODUCTS (EDITABLE)
   - Reemplazá imágenes por las tuyas (carpeta img/)
   - "gallery" permite varias imágenes
============================ */
const PRODUCTS = [
  {
    id: "cheesecake",
    name: "Cheesecake",
    category: "Tortas",
    price: 15000,
    desc: "Cremoso, artesanal y perfecto para compartir.",
    img: "img/Cheesecake-1.jpeg",
    gallery: ["img/Cheesecake-1.jpeg"]
  },
  {
    id: "mesa-dulce",
    name: "Mesa dulce",
    category: "Eventos",
    price: 60000,
    desc: "Variedad para cumpleaños, reuniones y eventos.",
    img: "img/mesa-dulce-1.JPG",
    gallery: ["img/mesa-dulce-1.JPG"]
  },
  {
    id: "focaccias",
    name: "Focaccias",
    category: "Panificados",
    price: 9000,
    desc: "Esponjosas, sabrosas y hechas en casa.",
    img: "img/Focaccias-1.jpeg",
    gallery: ["img/Focaccias-1.jpeg", "img/Focaccias-2.jpeg", "img/Focaccias-3.jpeg"]
  },
  {
    id: "tarta-frutillas",
    name: "Tarta de frutillas",
    category: "Tartas",
    price: 18000,
    desc: "Fresca, delicada y súper rendidora.",
    img: "img/Tarta-frutillas-1.jpeg",
    gallery: ["img/Tarta-frutillas-1.jpeg", "img/Tarta-frutillas-2.jpeg"]
  },
  {
    id: "torta-selva",
    name: "Torta Selva Negra",
    category: "Tortas",
    price: 24000,
    desc: "Clásica, elegante y con un toque intenso.",
    img: "img/Torta-selvanegra-1.jpeg",
    gallery: ["img/Torta-selvanegra-1.jpeg"]
  },
  {
    id: "budines-saludables",
    name: "Budines saludables",
    category: "Budines",
    price: 9500,
    desc: "Opciones livianas y riquísimas para todos los días.",
    img: "img/budines-saludables-1.jpeg",
    gallery: ["img/budines-saludables-1.jpeg", "img/budines-saludables-2.jpeg"]
  },
  {
    id: "pan-nube",
    name: "Pan nube",
    category: "Panificados",
    price: 7500,
    desc: "Suave, liviano y perfecto para acompañar.",
    img: "img/pan-nube-1.jpg",
    gallery: ["img/pan-nube-1.jpg", "img/pan-nube-2.jpg"]
  },
  {
    id: "nubes-simple",
    name: "Nubes (simple)",
    category: "Nubes",
    price: 7800,
    desc: "Tiernas, esponjosas y súper versátiles.",
    img: "img/Nubes-simple-1.jpeg",
    gallery: ["img/Nubes-simple-1.jpeg", "img/Nubes-simple-2.jpeg"]
  }
];

// destacados = primeros 4 por defecto
const FEATURED_IDS = ["cheesecake", "mesa-dulce", "focaccias", "tarta-frutillas"];

/* ============================
   Helpers
============================ */
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function moneyARS(n){
  try {
    return new Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS", maximumFractionDigits:0 }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString("es-AR")}`;
  }
}

function safeNumber(v){
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function productById(id){
  return PRODUCTS.find(p => p.id === id) || null;
}

/* ============================
   Links (IG)
============================ */
["igFab","instagramLink","footerInstagramLink"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = INSTAGRAM_URL;
});

/* ============================
   Mobile nav
============================ */
const hamburgerBtn = $("#hamburgerBtn");
const mobileNav = $("#mobileNav");
if (hamburgerBtn && mobileNav){
  hamburgerBtn.addEventListener("click", () => mobileNav.classList.toggle("is-open"));
  $$(".mobileNav__link", mobileNav).forEach(a => {
    a.addEventListener("click", () => mobileNav.classList.remove("is-open"));
  });
}

/* ============================
   Back to top
============================ */
const backToTopBtn = $("#backToTopBtn");
window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 500);
});
if (backToTopBtn){
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ============================
   Reveal on scroll (animaciones)
============================ */
(function initReveal(){
  const els = $$(".reveal");
  if (els.length === 0) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting){
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();

/* ============================
   Catalog render
============================ */
const featuredGrid = $("#featuredGrid");
const catalogGrid = $("#catalogGrid");

function cardTemplate(p){
  return `
    <article class="card product" data-id="${escapeHtml(p.id)}">
      <div class="badgeGlow" aria-hidden="true"></div>
      <img class="card__img" src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" loading="lazy">
      <div class="card__body">
        <div class="card__top">
          <h3 class="card__title">${escapeHtml(p.name)}</h3>
          <span class="tag">${escapeHtml(p.category)}</span>
        </div>
        <p class="card__desc">${escapeHtml(p.desc || "Podés consultar por tamaños y personalización.")}</p>
        <div class="card__bottom">
          <div class="price">
            <span class="price__label">Desde</span>
            <span class="price__value">${moneyARS(p.price)}</span>
          </div>
          <div class="card__actions">
            <button class="btn btn--small btn--ghost js-view" type="button">Ver</button>
            <button class="btn btn--small btn--primary js-add" type="button">Agregar</button>
          </div>
        </div>
      </div>
    </article>
  `;
}

function renderFeatured(){
  if (!featuredGrid) return;
  const list = FEATURED_IDS.map(id => productById(id)).filter(Boolean);
  featuredGrid.innerHTML = list.map(cardTemplate).join("");
}

let currentCatalog = [...PRODUCTS];

function renderCatalog(list){
  if (!catalogGrid) return;
  catalogGrid.innerHTML = list.map(cardTemplate).join("");
}

renderFeatured();

/* ============================
   Filters
============================ */
const searchInput = $("#searchInput");
const categorySelect = $("#categorySelect");
const sortSelect = $("#sortSelect");

function fillCategories(){
  if (!categorySelect) return;
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category))).sort((a,b)=>a.localeCompare(b,"es"));
  const options = ["Todas", ...cats].map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  categorySelect.innerHTML = options;
}

function applyCatalog(){
  const q = (searchInput?.value || "").trim().toLowerCase();
  const cat = categorySelect?.value || "Todas";
  const sort = sortSelect?.value || "recomendado";

  let list = PRODUCTS.filter(p => {
    const matchesQ = q === "" || p.name.toLowerCase().includes(q);
    const matchesC = cat === "Todas" || p.category === cat;
    return matchesQ && matchesC;
  });

  if (sort === "precio-asc"){
    list.sort((a,b)=>a.price - b.price);
  } else if (sort === "precio-desc"){
    list.sort((a,b)=>b.price - a.price);
  } else if (sort === "nombre-asc"){
    list.sort((a,b)=>a.name.localeCompare(b.name,"es"));
  } // recomendado: orden original

  currentCatalog = list;
  renderCatalog(list);
}

fillCategories();
applyCatalog();

[searchInput, categorySelect, sortSelect].forEach(el => {
  if (!el) return;
  el.addEventListener("input", applyCatalog);
  el.addEventListener("change", applyCatalog);
});

/* ============================
   Modal
============================ */
const productModal = $("#productModal");
const modalMainImg = $("#modalMainImg");
const modalThumbs = $("#modalThumbs");
const modalTitle = $("#modalTitle");
const modalCategory = $("#modalCategory");
const modalPrice = $("#modalPrice");
const modalDesc = $("#modalDesc");
const modalAddBtn = $("#modalAddBtn");
const modalGoCartBtn = $("#modalGoCartBtn");

let modalProductId = null;

function openModal(productId){
  const p = productById(productId);
  if (!p || !productModal) return;

  modalProductId = p.id;
  modalTitle.textContent = p.name;
  modalCategory.textContent = p.category;
  modalPrice.textContent = moneyARS(p.price);
  modalDesc.textContent = p.desc || "Podés consultar por tamaños/porciones.";

  const gallery = (p.gallery && p.gallery.length ? p.gallery : [p.img]).filter(Boolean);
  const main = gallery[0] || p.img;

  modalMainImg.src = main;
  modalMainImg.alt = p.name;

  modalThumbs.innerHTML = "";
  gallery.forEach((src, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "thumb" + (idx === 0 ? " is-active" : "");
    btn.innerHTML = `<img src="${src}" alt="Vista ${idx+1} de ${escapeHtml(p.name)}" loading="lazy">`;
    btn.addEventListener("click", () => {
      modalMainImg.src = src;
      $$(".thumb", modalThumbs).forEach(t => t.classList.remove("is-active"));
      btn.classList.add("is-active");
    });
    modalThumbs.appendChild(btn);
  });

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}

function closeModal(){
  if (!productModal) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
  modalProductId = null;
}

if (productModal){
  productModal.addEventListener("click", (e) => {
    const close = e.target?.dataset?.close === "true";
    if (close) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && productModal.classList.contains("is-open")) closeModal();
  });
}

if (modalAddBtn){
  modalAddBtn.addEventListener("click", () => {
    if (!modalProductId) return;
    addToCart(modalProductId);
    openCart();
  });
}
if (modalGoCartBtn){
  modalGoCartBtn.addEventListener("click", () => openCart());
}

/* ============================
   Cart
============================ */
const CART_KEY = "luisa_cart_v2";

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
    if (!raw) return { items:{}, notes:"" };
    const data = JSON.parse(raw);
    return {
      items: (data && data.items && typeof data.items === "object") ? data.items : {},
      notes: (data && typeof data.notes === "string") ? data.notes : ""
    };
  } catch {
    return { items:{}, notes:"" };
  }
}
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function cartItemsArray(){ return Object.values(cart.items); }

function addToCart(productId){
  const p = productById(productId);
  if (!p) return;

  if (!cart.items[p.id]){
    cart.items[p.id] = { id:p.id, name:p.name, price:p.price, img:p.img, qty:1 };
  } else {
    cart.items[p.id].qty += 1;
  }
  saveCart();
  renderCart();
  toast(`Agregado: ${p.name}`);
}

function removeFromCart(productId){
  delete cart.items[productId];
  saveCart();
  renderCart();
}

function changeQty(productId, delta){
  const it = cart.items[productId];
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) delete cart.items[productId];
  saveCart();
  renderCart();
}

function clearCart(){
  cart = { items:{}, notes: cart.notes || "" };
  saveCart();
  renderCart();
}

function cartCountValue(){
  return cartItemsArray().reduce((acc, it) => acc + it.qty, 0);
}
function cartTotalValue(){
  return cartItemsArray().reduce((acc, it) => acc + (it.price * it.qty), 0);
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
        <p style="margin:0; line-height:1.6;">
          Tu carrito está vacío. Volvé al catálogo y agregá productos.
        </p>
      </div>
    `;
  } else {
    items.forEach(it => {
      const row = document.createElement("div");
      row.className = "cartItem";
      row.innerHTML = `
        <img class="cartItem__img" src="${escapeHtml(it.img)}" alt="${escapeHtml(it.name)}" loading="lazy" />
        <div>
          <p class="cartItem__name">${escapeHtml(it.name)}</p>

          <div class="cartItem__meta">
            <span>${moneyARS(it.price)} c/u</span>
            <button class="cartItem__remove" type="button" data-remove="${escapeHtml(it.id)}">Eliminar</button>
          </div>

          <div class="qty" aria-label="Cantidad">
            <button type="button" data-qty="${escapeHtml(it.id)}" data-delta="-1" aria-label="Restar">−</button>
            <span>${it.qty}</span>
            <button type="button" data-qty="${escapeHtml(it.id)}" data-delta="1" aria-label="Sumar">+</button>
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
  cartDrawer.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
}

function closeCart(){
  if (!cartDrawer) return;
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
}

if (openCartBtn) openCartBtn.addEventListener("click", openCart);

if (cartDrawer){
  cartDrawer.addEventListener("click", (e) => {
    const t = e.target;

    if (t?.dataset?.closeCart === "true"){
      closeCart();
      return;
    }

    const removeId = t?.dataset?.remove;
    if (removeId){
      removeFromCart(removeId);
      return;
    }

    const qtyId = t?.dataset?.qty;
    const delta = safeNumber(t?.dataset?.delta);
    if (qtyId && delta){
      changeQty(qtyId, delta);
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
   WhatsApp
============================ */
function buildOrderMessage(){
  const items = cartItemsArray();
  const notes = (cart.notes || "").trim();

  if (items.length === 0){
    return "Hola! Quiero consultar por productos y disponibilidad en Luisa Pastelería 🙂";
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
  const clean = (WHATSAPP_NUMBER || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  const url = clean ? `https://wa.me/${clean}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

if (sendWspBtn){
  sendWspBtn.addEventListener("click", () => {
    openWhatsAppWithMessage(buildOrderMessage());
  });
}

function quickWsp(){
  openWhatsAppWithMessage("Hola! Quiero consultar por productos y disponibilidad en Luisa Pastelería 🙂");
}
if (heroWspBtn) heroWspBtn.addEventListener("click", quickWsp);
if (contactWspBtn) contactWspBtn.addEventListener("click", quickWsp);

/* ============================
   Click handling (catalog + featured)
   - Evita bug de SVG/paths: usamos closest('button')
============================ */
function bindGridClicks(gridEl){
  if (!gridEl) return;
  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const card = btn.closest(".product");
    if (!card) return;

    const id = card.dataset.id;
    if (!id) return;

    if (btn.classList.contains("js-add")){
      addToCart(id);
      return;
    }
    if (btn.classList.contains("js-view")){
      openModal(id);
      return;
    }
  });
}

bindGridClicks(featuredGrid);
bindGridClicks(catalogGrid);

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
    el.style.transform = "translateX(-50%) translateY(8px)";
    el.style.padding = "10px 14px";
    el.style.borderRadius = "999px";
    el.style.border = "1px solid rgba(23,23,23,.18)";
    el.style.background = "rgba(255,255,255,.92)";
    el.style.boxShadow = "0 18px 40px rgba(15,15,15,.14)";
    el.style.fontWeight = "900";
    el.style.zIndex = "140";
    el.style.opacity = "0";
    el.style.transition = "opacity .18s ease, transform .18s ease";
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.opacity = "1";
  el.style.transform = "translateX(-50%) translateY(0)";

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.style.opacity = "0";
    el.style.transform = "translateX(-50%) translateY(8px)";
  }, 1400);
}

/* ============================
   Init
============================ */
renderCart();
