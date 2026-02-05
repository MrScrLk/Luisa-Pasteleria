/* ============================
   CONFIG
   ============================ */
const WHATSAPP_NUMBER = "54911XXXXXXXX"; // Ej: "5491122334455"
const INSTAGRAM_URL   = "https://www.instagram.com/tu_cuenta/"; // Cambiar

/* ============================
   HELPERS
   ============================ */
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

function moneyARS(n){
  try{
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
function uniq(arr){
  return Array.from(new Set(arr));
}


const PRODUCTS = [
  {
    sku: "cheesecake",
    name: "Cheesecake",
    category: "Tortas",
    price: 15000,
    desc: "Cremoso, artesanal y perfecto para compartir.",
    img: "img/Cheesecake-1.jpeg",
    gallery: ["img/Cheesecake-1.jpeg"],
    featured: true,
  },
  {
    sku: "mesa-dulce",
    name: "Mesa dulce",
    category: "Eventos",
    price: 60000,
    desc: "Variedad para cumpleaños, reuniones y eventos.",
    img: "img/mesa-dulce-1.JPG",
    gallery: ["img/mesa-dulce-1.JPG"],
    featured: true,
  },
  {
    sku: "focaccias",
    name: "Focaccias",
    category: "Panificados",
    price: 9000,
    desc: "Esponjosas, sabrosas y hechas en casa.",
    img: "img/Focaccias-1.jpeg",
    gallery: ["img/Focaccias-1.jpeg","img/Focaccias-2.jpeg","img/Focaccias-3.jpeg","img/Focaccias-4.jpeg","img/Focaccias-5.jpeg"],
    featured: true,
  },
  {
    sku: "tarta-frutillas",
    name: "Tarta de frutillas",
    category: "Tartas",
    price: 18000,
    desc: "Fresca, delicada y súper rendidora.",
    img: "img/Tarta-frutillas-1.jpeg",
    gallery: ["img/Tarta-frutillas-1.jpeg","img/Tarta-frutillas-2.jpeg"],
    featured: true,
  },

  /* Agregá más productos abajo */
  {
    sku: "budines-saludables",
    name: "Budines saludables",
    category: "Budines",
    price: 9500,
    desc: "Opciones livianas y riquísimas para todos los días.",
    img: "img/budines-saludables-1.jpeg",
    gallery: ["img/budines-saludables-1.jpeg","img/budines-saludables-2.jpeg","img/budines-saludables-3.jpeg"],
    featured: false,
  },
  {
    sku: "pan-nube",
    name: "Pan nube",
    category: "Panificados",
    price: 7500,
    desc: "Suave, liviano y perfecto para acompañar.",
    img: "img/pan-nube-1.jpg",
    gallery: ["img/pan-nube-1.jpg","img/pan-nube-2.jpg"],
    featured: false,
  },
  {
    sku: "nubes-simple",
    name: "Nubes (simple)",
    category: "Nubes",
    price: 7800,
    desc: "Tiernas, esponjosas y súper versátiles.",
    img: "img/Nubes-simple-1.jpeg",
    gallery: ["img/Nubes-simple-1.jpeg","img/Nubes-simple-2.jpeg","img/Nubes-simple-3.jpeg"],
    featured: false,
  },
     // =========================
  // Nuevos productos
  // =========================
  {
    sku: "focaccias",
    name: "Focaccias",
    category: "Salado",
    price: 0,
    desc: "Focaccias artesanales. Consultar variedades y disponibilidad.",
    img: "img/Focaccias-1.jpeg",
    gallery: [
      "img/Focaccias-1.jpeg",
      "img/Focaccias-2.jpeg",
      "img/Focaccias-3.jpeg",
      "img/Focaccias-4.jpeg",
      "img/Focaccias-5.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-simple",
    name: "Nubes simples",
    category: "Nubes",
    price: 0,
    desc: "Nubes artesanales (variante simple). Consultar sabores.",
    img: "img/Nubes-simple-1.jpeg",
    gallery: [
      "img/Nubes-simple-1.jpeg",
      "img/Nubes-simple-2.jpeg",
      "img/Nubes-simple-3.jpeg",
      "img/Nubes-simple-4.jpeg",
      "img/Nubes-simple-5.jpeg",
      "img/Nubes-simple-6.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-coco",
    name: "Nubes de coco",
    category: "Nubes",
    price: 0,
    desc: "Nubes artesanales con coco.",
    img: "img/Nubes-coco-1.jpeg",
    gallery: [
      "img/Nubes-coco-1.jpeg",
      "img/Nubes-coco-2.jpeg",
      "img/Nubes-coco-3.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-cacao-dulces",
    name: "Nubes cacao (dulces)",
    category: "Nubes",
    price: 0,
    desc: "Nubes de cacao (versión dulce).",
    img: "img/Nubes-Cacao-dulces-1.jpeg",
    gallery: [
      "img/Nubes-Cacao-dulces-1.jpeg",
      "img/Nubes-Cacao-dulces-2.jpeg",
      "img/Nubes-Cacao-dulces-3.jpeg",
      "img/Nubes-Cacao-dulces-4.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-naranja",
    name: "Nubes de naranja",
    category: "Nubes",
    price: 0,
    desc: "Nubes artesanales sabor naranja.",
    img: "img/Nubes-naranja-1.jpeg",
    gallery: [
      "img/Nubes-naranja-1.jpeg",
      "img/Nubes-naranja-2.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-semillas",
    name: "Nubes con semillas",
    category: "Nubes",
    price: 0,
    desc: "Nubes artesanales con mix de semillas.",
    img: "img/Nubes-semillas-1.jpeg",
    gallery: [
      "img/Nubes-semillas-1.jpeg",
      "img/Nubes-semillas-2.jpeg",
      "img/Nubes-semillas-3.jpeg",
      "img/Nubes-semillas-4.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-especiados",
    name: "Nubes especiados",
    category: "Nubes",
    price: 0,
    desc: "Nubes artesanales con especias.",
    img: "img/Nubes-especiados-1.jpeg",
    gallery: [
      "img/Nubes-especiados-1.jpeg",
      "img/Nubes-especiados-2.jpeg",
      "img/Nubes-especiados-3.jpeg",
      "img/Nubes-especiados-4.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-lomo",
    name: "Nubes lomo",
    category: "Nubes",
    price: 0,
    desc: "Nubes (variante lomo).",
    img: "img/Nubes-lomo-1.jpeg",
    gallery: [
      "img/Nubes-lomo-1.jpeg",
      "img/Nubes-lomo-2.jpeg",
      "img/Nubes-lomo-3.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-pata",
    name: "Nubes pata",
    category: "Nubes",
    price: 0,
    desc: "Nubes (variante pata).",
    img: "img/Nubes-Pata-1.jpeg",
    gallery: [
      "img/Nubes-Pata-1.jpeg",
      "img/Nubes-Pata-2.jpeg",
      "img/Nubes-Pata-3.jpeg",
      "img/Nubes-Pata-4.jpeg",
      "img/Nubes-Pata-5.jpeg",
      "img/Nubes-Pata-6.jpeg",
      "img/Nubes-Pata-7.jpeg",
    ],
    featured: false,
  },
  {
    sku: "nubes-harina-almendra",
    name: "Nubes harina de almendra",
    category: "Nubes",
    price: 0,
    desc: "Nubes con harina de almendra.",
    img: "img/nubes-harina-almendra-1.jpeg",
    gallery: [
      "img/nubes-harina-almendra-1.jpeg",
      "img/nubes-harina-almendra-2.jpeg",
      "img/nubes-harina-almendra-3.jpeg",
      "img/nubes-harina-almendra-4.jpeg",
    ],
    featured: false,
  },
  {
    sku: "pan-nube",
    name: "Pan nube",
    category: "Panificados",
    price: 0,
    desc: "Pan nube artesanal.",
    img: "img/pan-nube-1.jpg",
    gallery: [
      "img/pan-nube-1.jpg",
      "img/pan-nube-2.jpg",
    ],
    featured: false,
  },
  {
    sku: "hero-pan-nubes",
    name: "Pan & Nubes (Hero)",
    category: "Fotos",
    price: 0,
    desc: "Imagen destacada (hero).",
    img: "img/hero-pan-nubes.JPG",
    gallery: ["img/hero-pan-nubes.JPG"],
    featured: false,
  },
  {
    sku: "mesa-dulce",
    name: "Mesa dulce",
    category: "Eventos",
    price: 60000,
    desc: "Variedad para cumpleaños, reuniones y eventos.",
    img: "img/mesa-dulce-1.JPG",
    gallery: ["img/mesa-dulce-1.JPG"],
    featured: true,
  },
  {
    sku: "budines-saludables",
    name: "Budines saludables",
    category: "Budines",
    price: 0,
    desc: "Budines saludables (varias opciones).",
    img: "img/budines-saludables-1.jpeg",
    gallery: [
      "img/budines-saludables-1.jpeg",
      "img/budines-saludables-2.jpeg",
      "img/budines-saludables-3.jpeg",
      "img/budines-saludables-4.jpeg",
      "img/budines-saludables-5.jpeg",
      "img/budines-saludables-6.jpeg",
    ],
    featured: false,
  },
  {
    sku: "facturas",
    name: "Facturas",
    category: "Panificados",
    price: 0,
    desc: "Facturas artesanales. Consultar por docena.",
    img: "img/facturas-1.JPG",
    gallery: ["img/facturas-1.JPG"],
    featured: false,
  },
  {
    sku: "chipa",
    name: "Chipa",
    category: "Salado",
    price: 0,
    desc: "Chipa artesanal.",
    img: "img/chipa-1.JPG",
    gallery: ["img/chipa-1.JPG"],
    featured: false,
  },
  {
    sku: "scones",
    name: "Scones",
    category: "Panificados",
    price: 0,
    desc: "Scones artesanales.",
    img: "img/scones-1.JPG",
    gallery: ["img/scones-1.JPG"],
    featured: false,
  },
  {
    sku: "pepas-scones",
    name: "Pepas (scones)",
    category: "Panificados",
    price: 0,
    desc: "Pepas tipo scones.",
    img: "img/Pepas-scones-1.jpeg",
    gallery: ["img/Pepas-scones-1.jpeg"],
    featured: false,
  },
  {
    sku: "tarta-frutillas",
    name: "Tarta de frutillas",
    category: "Tortas",
    price: 0,
    desc: "Tarta fresca de frutillas.",
    img: "img/Tarta-frutillas-1.jpeg",
    gallery: [
      "img/Tarta-frutillas-1.jpeg",
      "img/Tarta-frutillas-2.jpeg",
    ],
    featured: false,
  },
  {
    sku: "tarta-peras-almendras",
    name: "Tarta de peras y almendras",
    category: "Tortas",
    price: 0,
    desc: "Tarta de peras con almendras.",
    img: "img/tarta-peras-almendras-1.jpeg",
    gallery: ["img/tarta-peras-almendras-1.jpeg"],
    featured: false,
  },
  {
    sku: "torta-selva-negra",
    name: "Torta Selva Negra",
    category: "Tortas",
    price: 0,
    desc: "Torta selva negra clásica.",
    img: "img/Torta-selvanegra-1.jpeg",
    gallery: ["img/Torta-selvanegra-1.jpeg"],
    featured: false,
  },
  {
    sku: "torta-harina-nuez",
    name: "Torta harina de nuez",
    category: "Tortas",
    price: 0,
    desc: "Torta con harina de nuez.",
    img: "img/torta-harina-nuez-1.jpeg",
    gallery: [
      "img/torta-harina-nuez-1.jpeg",
      "img/torta-harina-nuez-2.jpeg",
      "img/torta-harina-nuez-3.jpeg",
    ],
    featured: false,
  },
  {
    sku: "torta",
    name: "Torta",
    category: "Tortas",
    price: 0,
    desc: "Torta artesanal.",
    img: "img/torta-1.JPG",
    gallery: ["img/torta-1.JPG"],
    featured: false,
  },

];

/* ============================
   DOM
   ============================ */
const hamburgerBtn = $("#hamburgerBtn");
const mobileNav = $("#mobileNav");

const backToTopBtn = $("#backToTopBtn");

const featuredGrid = $("#featuredGrid");
const catalogGrid = $("#catalogGrid");

const searchInput = $("#searchInput");
const categorySelect = $("#categorySelect");
const sortSelect = $("#sortSelect");

const igFab = $("#igFab");
const igLink = $("#igLink");

const openCartBtn = $("#openCartBtn");
const cartDrawer = $("#cartDrawer");
const cartList = $("#cartList");
const cartCount = $("#cartCount");
const cartTotal = $("#cartTotal");
const notesInput = $("#notesInput");
const sendWspBtn = $("#sendWspBtn");
const clearCartBtn = $("#clearCartBtn");

const heroWspBtn = $("#heroWspBtn");
const contactWspBtn = $("#contactWspBtn");

const productModal = $("#productModal");
const modalMainImg = $("#modalMainImg");
const modalThumbs = $("#modalThumbs");
const modalTitle = $("#modalTitle");
const modalCategory = $("#modalCategory");
const modalPrice = $("#modalPrice");
const modalDesc = $("#modalDesc");
const modalAddBtn = $("#modalAddBtn");
const modalGoCartBtn = $("#modalGoCartBtn");

/* ============================
   NAV
   ============================ */
if (hamburgerBtn && mobileNav){
  hamburgerBtn.addEventListener("click", () => mobileNav.classList.toggle("is-open"));
  $$(".mobileNav__link", mobileNav).forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("is-open")));
}

/* ============================
   SOCIAL LINKS
   ============================ */
if (igFab) igFab.href = INSTAGRAM_URL;
if (igLink) igLink.href = INSTAGRAM_URL;

/* ============================
   BACK TO TOP
   ============================ */
window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;
  backToTopBtn.classList.toggle("is-visible", window.scrollY > 500);
});
if (backToTopBtn){
  backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ============================
   RENDER PRODUCTS
   ============================ */
function productCardHTML(p){
  const price = moneyARS(p.price);
  const safeImg = escapeHtml(p.img || "");
  const safeName = escapeHtml(p.name);
  const safeCat = escapeHtml(p.category);
  const safeDesc = escapeHtml(p.desc || "");

  return `
    <article class="card product" data-sku="${escapeHtml(p.sku)}" aria-label="${safeName}">
      <img class="card__img" src="${safeImg}" alt="${safeName}" loading="lazy"
        onerror="this.style.opacity='.0'; this.style.background='linear-gradient(135deg, rgba(231,217,255,.55), rgba(231,245,242,.55))';" />
      <div class="card__body">
        <div class="card__top">
          <h3 class="card__title">${safeName}</h3>
          <span class="tag">${safeCat}</span>
        </div>
        <p class="card__desc">${safeDesc || "Consultá por personalización y tamaños."}</p>
        <div class="card__bottom">
          <div class="price">
            <span class="price__label">Desde</span>
            <span class="price__value">${price}</span>
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
  const featured = PRODUCTS.filter(p => p.featured);
  featuredGrid.innerHTML = featured.map(productCardHTML).join("");
}

function renderCatalog(products){
  if (!catalogGrid) return;
  catalogGrid.innerHTML = products.map(productCardHTML).join("");
}

function renderCategorySelect(){
  if (!categorySelect) return;
  const cats = uniq(PRODUCTS.map(p => p.category)).sort((a,b) => a.localeCompare(b,"es"));
  categorySelect.innerHTML = [
    `<option value="Todas">Todas</option>`,
    ...cats.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
  ].join("");
}

/* ============================
   FILTER / SORT
   ============================ */
function applyCatalog(){
  const q = (searchInput?.value || "").trim().toLowerCase();
  const cat = categorySelect?.value || "Todas";
  const sort = sortSelect?.value || "recomendado";

  let list = [...PRODUCTS];

  if (q){
    list = list.filter(p => (p.name || "").toLowerCase().includes(q));
  }
  if (cat !== "Todas"){
    list = list.filter(p => p.category === cat);
  }

  if (sort === "precio-asc"){
    list.sort((a,b) => safeNumber(a.price) - safeNumber(b.price));
  } else if (sort === "precio-desc"){
    list.sort((a,b) => safeNumber(b.price) - safeNumber(a.price));
  } else if (sort === "nombre-asc"){
    list.sort((a,b) => (a.name||"").localeCompare((b.name||""), "es"));
  } // recomendado: queda como está

  renderCatalog(list);
}

[searchInput, categorySelect, sortSelect].forEach(el => {
  if (!el) return;
  el.addEventListener("input", applyCatalog);
  el.addEventListener("change", applyCatalog);
});

/* ============================
   MODAL
   ============================ */
let modalSku = null;

function openModalBySku(sku){
  const p = PRODUCTS.find(x => x.sku === sku);
  if (!p || !productModal) return;

  modalSku = sku;

  modalTitle.textContent = p.name;
  modalCategory.textContent = p.category;
  modalPrice.textContent = moneyARS(p.price);
  if (modalDesc) modalDesc.textContent = p.desc || "Consultá por personalización y tamaños.";

  const gallery = (p.gallery && p.gallery.length) ? p.gallery : [p.img].filter(Boolean);

  modalMainImg.src = gallery[0] || "";
  modalMainImg.alt = p.name || "Producto";

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
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
}

function closeModal(){
  if (!productModal) return;
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  modalSku = null;
}

if (productModal){
  productModal.addEventListener("click", (e) => {
    const target = e.target;
    if (target?.dataset?.close === "true") closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && productModal.classList.contains("is-open")) closeModal();
  });
}

if (modalAddBtn){
  modalAddBtn.addEventListener("click", () => {
    if (!modalSku) return;
    addToCart(modalSku, 1);
    openCart();
  });
}
if (modalGoCartBtn){
  modalGoCartBtn.addEventListener("click", openCart);
}

/* ============================
   EVENT DELEGATION (ANTI-BUG)
   - Un solo listener por grilla
   ============================ */
function bindGridClicks(gridEl){
  if (!gridEl) return;

  gridEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const card = btn.closest(".product");
    if (!card) return;

    const sku = card.dataset.sku;
    if (!sku) return;

    if (btn.classList.contains("js-view")){
      openModalBySku(sku);
      return;
    }
    if (btn.classList.contains("js-add")){
      // mini anti-doble-click
      btn.disabled = true;
      addToCart(sku, 1);
      setTimeout(() => (btn.disabled = false), 350);
      return;
    }
  });
}

/* ============================
   CART
   ============================ */
const CART_KEY = "luisa_pasteleria_cart_v2";
let cart = loadCart();

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return { items: {}, notes: "" };
    const parsed = JSON.parse(raw);
    return {
      items: parsed?.items && typeof parsed.items === "object" ? parsed.items : {},
      notes: typeof parsed?.notes === "string" ? parsed.notes : ""
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
function cartCountValue(){
  return cartItemsArray().reduce((acc, it) => acc + safeNumber(it.qty), 0);
}
function cartTotalValue(){
  return cartItemsArray().reduce((acc, it) => acc + safeNumber(it.price) * safeNumber(it.qty), 0);
}

function addToCart(sku, qty=1){
  const p = PRODUCTS.find(x => x.sku === sku);
  if (!p) return;

  if (!cart.items[sku]){
    cart.items[sku] = { sku, name: p.name, price: p.price, img: p.img, qty: 0 };
  }
  cart.items[sku].qty += qty;
  if (cart.items[sku].qty <= 0) delete cart.items[sku];

  saveCart();
  renderCart();
  toast(`Agregado: ${p.name}`);
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

function renderCart(){
  if (cartCount) cartCount.textContent = String(cartCountValue());
  if (notesInput) notesInput.value = cart.notes || "";

  if (!cartList || !cartTotal) return;

  const items = cartItemsArray();
  cartList.innerHTML = "";

  if (items.length === 0){
    cartList.innerHTML = `
      <div class="empty">
        <p style="margin:0; color: rgba(23,23,23,.72); line-height:1.6;">
          Tu carrito está vacío. Volvé al catálogo y agregá productos.
        </p>
      </div>
    `;
  } else {
    items.forEach(it => {
      const row = document.createElement("div");
      row.className = "cartItem";
      row.innerHTML = `
        <img class="cartItem__img" src="${escapeHtml(it.img || "")}" alt="${escapeHtml(it.name || "Producto")}" loading="lazy"
          onerror="this.style.opacity='.0'; this.style.background='linear-gradient(135deg, rgba(231,217,255,.55), rgba(231,245,242,.55))';" />
        <div>
          <p class="cartItem__name">${escapeHtml(it.name || "Producto")}</p>
          <div class="cartItem__meta">
            <span>${moneyARS(it.price)} c/u</span>
            <button class="cartItem__remove" type="button" data-remove="${escapeHtml(it.sku)}">Eliminar</button>
          </div>

          <div class="qty" aria-label="Cantidad">
            <button type="button" data-qty="${escapeHtml(it.sku)}" data-delta="-1" aria-label="Restar">−</button>
            <span>${safeNumber(it.qty)}</span>
            <button type="button" data-qty="${escapeHtml(it.sku)}" data-delta="1" aria-label="Sumar">+</button>
          </div>
        </div>
      `;
      cartList.appendChild(row);
    });
  }

  cartTotal.textContent = moneyARS(cartTotalValue());
}

/* Drawer open/close */
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
   WHATSAPP ORDER
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
  const cleanNumber = (WHATSAPP_NUMBER || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  const url = cleanNumber ? `https://wa.me/${cleanNumber}?text=${text}` : `https://wa.me/?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

if (sendWspBtn){
  sendWspBtn.addEventListener("click", () => {
    openWhatsAppWithMessage(buildOrderMessage());
  });
}

function quickWsp(){
  const msg = "Hola! Quiero consultar por productos y disponibilidad en Luisa Pastelería 🙂";
  openWhatsAppWithMessage(msg);
}
if (heroWspBtn) heroWspBtn.addEventListener("click", quickWsp);
if (contactWspBtn) contactWspBtn.addEventListener("click", quickWsp);

/* ============================
   TOAST
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
    el.style.transform = "translateX(-50%) translateY(6px)";
    el.style.padding = "10px 14px";
    el.style.borderRadius = "999px";
    el.style.border = "1px solid rgba(23,23,23,.18)";
    el.style.background = "rgba(255,255,255,.94)";
    el.style.boxShadow = "0 18px 46px rgba(23,23,23,.14)";
    el.style.fontWeight = "900";
    el.style.zIndex = "120";
    el.style.opacity = "0";
    el.style.transition = "opacity .2s ease, transform .2s ease";
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
   INIT
   ============================ */
renderCategorySelect();
renderFeatured();
renderCatalog(PRODUCTS);
bindGridClicks(featuredGrid);
bindGridClicks(catalogGrid);

renderCart();
applyCatalog();
