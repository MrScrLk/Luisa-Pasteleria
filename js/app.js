// app.js
(() => {
  const $ = (sel, parent=document) => parent.querySelector(sel);
  const $$ = (sel, parent=document) => Array.from(parent.querySelectorAll(sel));

  const products = window.LP_PRODUCTS || [];
  const state = {
    q: "",
    filter: "all",
    sort: "featured",
    cart: loadCart(),
    favs: loadFavs(),
    theme: loadTheme()
  };

  // ===== Init =====
  setTheme(state.theme);
  $("#statProducts").textContent = String(products.length);

  renderFeatured();
  renderGrid();
  renderGallery();
  renderCart();

  wireUI();
  introAnimations();
  scrollAnimations();

  // ===== UI Wiring =====
  function wireUI(){
    $("#btnGoCatalog").addEventListener("click", () => {
      document.querySelector("#catalogo").scrollIntoView({behavior:"smooth"});
    });

    $("#btnSurprise").addEventListener("click", () => {
      const picks = products.filter(p => p.category === "pan-nube" || p.category === "nubes");
      const p = picks[Math.floor(Math.random() * picks.length)] || products[0];
      openModal(p.id);
      toast("Sorpresa ✨", `Te abrí: ${p.name}`);
    });

    // Chips del hero
    $$("#heroChips .chip").forEach(chip => {
      chip.addEventListener("click", () => {
        $$("#heroChips .chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        const f = chip.dataset.filter;
        // map del chip a select
        const mapped = (f === "nubes" || f === "pan-nube" || f === "budines" || f === "salado") ? f : "all";
        $("#filterSelect").value = mapped;
        state.filter = mapped;
        renderGrid(true);
        document.querySelector("#catalogo").scrollIntoView({behavior:"smooth"});
      });
    });

    // Selects + search
    $("#filterSelect").addEventListener("change", (e) => {
      state.filter = e.target.value;
      renderGrid(true);
    });
    $("#sortSelect").addEventListener("change", (e) => {
      state.sort = e.target.value;
      renderGrid(true);
    });

    $("#searchInput").addEventListener("input", (e) => {
      state.q = e.target.value.trim().toLowerCase();
      renderGrid(false);
    });

    $("#clearSearch").addEventListener("click", () => {
      $("#searchInput").value = "";
      state.q = "";
      renderGrid(false);
      $("#searchInput").focus();
    });

    // Animar cards (pulse)
    $("#btnPulseAll").addEventListener("click", () => {
      gsap.fromTo(".card",
        { y: 0, scale: 1 },
        { y: -6, scale: 1.01, duration: .22, stagger: .03, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    });

    // Theme
    $("#btnTheme").addEventListener("click", () => {
      state.theme = (state.theme === "light") ? "dark" : "light";
      setTheme(state.theme);
      saveTheme(state.theme);
      toast("Tema", state.theme === "light" ? "Modo claro activado" : "Modo oscuro activado");
    });

    // Drawer cart
    $("#btnCart").addEventListener("click", openDrawer);
    $("#drawerOverlay").addEventListener("click", closeDrawer);
    $("#btnCloseCart").addEventListener("click", closeDrawer);
    $("#btnKeepShopping").addEventListener("click", closeDrawer);

    // Footer clear cart
    $("#btnClearCart").addEventListener("click", () => {
      state.cart = {};
      saveCart(state.cart);
      renderCart();
      toast("Carrito", "Carrito vaciado");
    });

    // Checkout
    $("#btnCheckout").addEventListener("click", () => checkout());

    // Modal
    $("#modalOverlay").addEventListener("click", closeModal);
    $("#modalClose").addEventListener("click", closeModal);

    // Quick add hero
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-quickadd]");
      if(!btn) return;
      addToCart(btn.dataset.quickadd, 1);
    });

    // Tilt hero card
    tiltEffect($("#heroCard"));
  }

  // ===== Rendering =====
  function renderFeatured(){
    const wrap = $("#featuredGrid");
    const featured = products
      .filter(p => p.featured)
      .slice(0, 6);

    wrap.innerHTML = featured.map(p => cardHTML(p, {badge:"Destacado"})).join("");
    bindCardEvents(wrap);
  }

  function renderGrid(animate){
    const wrap = $("#productGrid");
    const list = getFilteredSorted();

    wrap.innerHTML = list.map(p => cardHTML(p)).join("");
    bindCardEvents(wrap);

    if(animate){
      gsap.fromTo(".card",
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: .35, stagger: .03, ease: "power2.out" }
      );
    }
  }

  function renderGallery(){
    const wrap = $("#gallery");
    wrap.innerHTML = products.map(p => `
      <div class="gItem" data-open="${p.id}" title="${escapeHTML(p.name)}">
        <img loading="lazy" src="${p.img}" alt="${escapeHTML(p.name)}" />
      </div>
    `).join("");

    wrap.addEventListener("click", (e) => {
      const item = e.target.closest(".gItem");
      if(!item) return;
      openModal(item.dataset.open);
    });
  }

  function renderCart(){
    const itemsWrap = $("#cartItems");
    const ids = Object.keys(state.cart);

    $("#cartCount").textContent = String(ids.reduce((a,id)=>a + state.cart[id], 0));

    if(ids.length === 0){
      itemsWrap.innerHTML = emptyCartHTML();
      $("#cartSubtotal").textContent = formatMoney(0);
      $("#cartShipping").textContent = formatMoney(0);
      $("#cartTotal").textContent = formatMoney(0);
      return;
    }

    const items = ids.map(id => {
      const p = products.find(x => x.id === id);
      return { p, qty: state.cart[id] };
    }).filter(x => x.p);

    itemsWrap.innerHTML = items.map(({p,qty}) => cartItemHTML(p, qty)).join("");

    itemsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-action]");
      if(!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if(action === "inc") addToCart(id, 1);
      if(action === "dec") addToCart(id, -1);
      if(action === "remove") removeFromCart(id);
    }, { once: true });

    const subtotal = calcSubtotal(items);
    const shipping = calcShipping(subtotal);
    const total = subtotal + shipping;

    $("#cartSubtotal").textContent = formatMoney(subtotal);
    $("#cartShipping").textContent = formatMoney(shipping);
    $("#cartTotal").textContent = formatMoney(total);
  }

  function bindCardEvents(container){
    container.addEventListener("click", (e) => {
      const open = e.target.closest("[data-open]");
      if(open){
        openModal(open.dataset.open);
        return;
      }
      const add = e.target.closest("[data-add]");
      if(add){
        addToCart(add.dataset.add, 1);
        return;
      }
      const fav = e.target.closest("[data-fav]");
      if(fav){
        toggleFav(fav.dataset.fav);
        fav.textContent = state.favs.includes(fav.dataset.fav) ? "♥" : "♡";
        return;
      }
    });
  }

  // ===== Cards / HTML =====
  function cardHTML(p, {badge} = {}){
    const favOn = state.favs.includes(p.id);
    const b = badge || (p.category === "pan-nube" ? "⭐ Estrella" : (p.isNew ? "Nuevo" : niceCategory(p.category)));
    const price = (p.price == null) ? `<span class="price muted">A consultar</span>` : `<span class="price">${formatMoney(p.price)}</span>`;

    return `
      <article class="card tilt" data-tilt>
        <div class="card__media" data-open="${p.id}">
          <img loading="lazy" src="${p.img}" alt="${escapeHTML(p.name)}" />
          <div class="card__badge">${escapeHTML(b)}</div>
          <button class="card__fav" data-fav="${p.id}" aria-label="Favorito">${favOn ? "♥" : "♡"}</button>
        </div>
        <div class="card__body" data-open="${p.id}">
          <div class="card__name">${escapeHTML(p.name)}</div>
          <div class="card__desc">${escapeHTML(p.desc)}</div>
          <div class="card__meta">
            ${price}
            <span class="muted">·</span>
            <span class="muted">${escapeHTML(niceCategory(p.category))}</span>
          </div>
        </div>
        <div class="card__actions">
          <button class="btn ghost" data-open="${p.id}">Ver</button>
          <button class="btn primary" data-add="${p.id}">Agregar</button>
        </div>
      </article>
    `;
  }

  function cartItemHTML(p, qty){
    return `
      <div class="cartItem">
        <img src="${p.img}" alt="${escapeHTML(p.name)}" />
        <div>
          <div class="cartItem__name">${escapeHTML(p.name)}</div>
          <div class="cartItem__sub">${escapeHTML(niceCategory(p.category))} · ${p.price == null ? "A consultar" : formatMoney(p.price)}</div>
          <div class="cartItem__row">
            <div class="qty">
              <button data-action="dec" data-id="${p.id}" aria-label="Restar">−</button>
              <span>${qty}</span>
              <button data-action="inc" data-id="${p.id}" aria-label="Sumar">+</button>
            </div>
            <button class="removeBtn" data-action="remove" data-id="${p.id}">Quitar</button>
          </div>
        </div>
      </div>
    `;
  }

  function emptyCartHTML(){
    return `
      <div class="miniNote">
        <strong>Tu carrito está vacío.</strong><br/>
        Elegí un producto del catálogo y tocá <b>Agregar</b>.
      </div>
      <div class="miniNote">
        Tip: probá un combo <b>Pan Nube + Nubes</b> para desayuno/merienda.
      </div>
    `;
  }

  // ===== Modal =====
  function openModal(id){
    const p = products.find(x => x.id === id);
    if(!p) return;

    $("#modalContent").innerHTML = `
      <div class="modalMedia">
        <img src="${p.img}" alt="${escapeHTML(p.name)}" />
      </div>
      <div class="modalInfo">
        <div class="modalTitle">${escapeHTML(p.name)}</div>
        <div class="modalText">${escapeHTML(p.desc)}</div>

        <div class="modalMeta">
          <span class="pTag">${escapeHTML(niceCategory(p.category))}</span>
          ${(p.tags||[]).slice(0,4).map(t => `<span class="pTag">${escapeHTML(t)}</span>`).join("")}
          ${p.featured ? `<span class="pTag">Destacado</span>` : ""}
          ${p.isNew ? `<span class="pTag">Nuevo</span>` : ""}
        </div>

        <div class="modalText">
          <b>${p.price == null ? "Precio: A consultar" : `Precio: ${formatMoney(p.price)}`}</b>
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:8px;">
          <button class="btn primary" id="modalAdd">Agregar al carrito</button>
          <button class="btn ghost" id="modalClose2">Cerrar</button>
        </div>

        <div class="miniNote" style="margin-top:10px;">
          <strong>Pedidos:</strong> cuando toques “Finalizar pedido”, se arma un mensaje listo para WhatsApp.
        </div>
      </div>
    `;

    $("#modalAdd").addEventListener("click", () => addToCart(p.id, 1));
    $("#modalClose2").addEventListener("click", closeModal);

    const modal = $("#modal");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    gsap.fromTo(".modal__panel", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .22, ease: "power2.out" });
  }

  function closeModal(){
    const modal = $("#modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  // ===== Cart logic =====
  function addToCart(id, delta){
    const cur = state.cart[id] || 0;
    const next = cur + delta;

    if(next <= 0) delete state.cart[id];
    else state.cart[id] = next;

    saveCart(state.cart);
    renderCart();
    bounceBadge();

    const p = products.find(x => x.id === id);
    if(delta > 0) toast("Agregado 🧁", `${p ? p.name : "Producto"} al carrito`);
    if(delta < 0) toast("Actualizado", `Cantidad ajustada`);
  }

  function removeFromCart(id){
    delete state.cart[id];
    saveCart(state.cart);
    renderCart();
    toast("Quitado", "Producto eliminado del carrito");
  }

  function openDrawer(){
    $("#drawer").classList.add("open");
    $("#drawer").setAttribute("aria-hidden", "false");
    gsap.fromTo(".drawer__panel", { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: .2, ease: "power2.out" });
  }

  function closeDrawer(){
    $("#drawer").classList.remove("open");
    $("#drawer").setAttribute("aria-hidden", "true");
  }

  function checkout(){
    const ids = Object.keys(state.cart);
    if(ids.length === 0){
      toast("Carrito vacío", "Agregá algo antes de finalizar");
      openDrawer();
      return;
    }

    const lines = ids.map(id => {
      const p = products.find(x => x.id === id);
      const qty = state.cart[id];
      return `• ${qty} x ${p ? p.name : id}`;
    }).join("%0A");

    const msg = `Hola! Quiero hacer un pedido:%0A${lines}%0A%0AGracias!`;
    // Poné el link real en el HTML (más abajo podés editarlo). Mientras tanto abrimos un WhatsApp genérico:
    const wa = `https://wa.me/?text=${msg}`;
    window.open(wa, "_blank", "noopener,noreferrer");

    toast("Pedido listo ✅", "Se abrió WhatsApp con tu pedido");
  }

  function calcSubtotal(items){
    // Si no hay precios (null), queda en 0 (es “A consultar”)
    return items.reduce((sum, {p, qty}) => sum + ((p.price || 0) * qty), 0);
  }

  function calcShipping(subtotal){
    // simple: envío gratis a partir de cierto monto (si no usás precios, va a dar 0)
    if(subtotal === 0) return 0;
    return subtotal >= 20000 ? 0 : 1200;
  }

  // ===== Filtering/Sorting =====
  function getFilteredSorted(){
    const q = state.q;
    const f = state.filter;

    let list = products.slice();

    if(f !== "all"){
      list = list.filter(p => p.category === f);
    }

    if(q){
      list = list.filter(p => {
        const hay = `${p.name} ${p.desc} ${(p.tags||[]).join(" ")} ${p.category}`.toLowerCase();
        return hay.includes(q);
      });
    }

    list.sort((a,b) => {
      if(state.sort === "featured"){
        const fa = (a.featured ? 1 : 0) + (a.category === "pan-nube" ? 1 : 0);
        const fb = (b.featured ? 1 : 0) + (b.category === "pan-nube" ? 1 : 0);
        return fb - fa;
      }
      if(state.sort === "az") return a.name.localeCompare(b.name);
      if(state.sort === "za") return b.name.localeCompare(a.name);
      if(state.sort === "new") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });

    return list;
  }

  // ===== Favorites =====
  function toggleFav(id){
    const idx = state.favs.indexOf(id);
    if(idx >= 0) state.favs.splice(idx, 1);
    else state.favs.push(id);
    saveFavs(state.favs);
    toast("Favoritos", idx >= 0 ? "Eliminado de favoritos" : "Agregado a favoritos");
  }

  // ===== Toast =====
  function toast(title, text){
    const wrap = $("#toasts");
    const node = document.createElement("div");
    node.className = "toast";
    node.innerHTML = `<strong>${escapeHTML(title)}</strong><span>${escapeHTML(text)}</span>`;
    wrap.appendChild(node);

    gsap.fromTo(node, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .22, ease:"power2.out" });

    setTimeout(() => {
      gsap.to(node, { y: 8, opacity: 0, duration: .22, onComplete: () => node.remove() });
    }, 2400);
  }

  function bounceBadge(){
    gsap.fromTo("#cartCount",
      { scale: 1 },
      { scale: 1.25, duration: .14, yoyo:true, repeat:1, ease:"power2.out" }
    );
  }

  // ===== Tilt =====
  function tiltEffect(el){
    if(!el) return;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotationY: x * 8, rotationX: -y * 8, transformPerspective: 800, duration: .25, ease: "power2.out" });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: .35, ease:"power2.out" });
    });

    // también para cards
    $$(".tilt[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotationY: x * 6, rotationX: -y * 6, transformPerspective: 900, duration: .22, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotationX: 0, rotationY: 0, duration: .3, ease:"power2.out" });
      });
    });
  }

  // ===== Animations =====
  function introAnimations(){
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(".brand", { y: -10, opacity: 0 }, { y: 0, opacity: 1, duration: .35, ease:"power2.out" });
    gsap.fromTo(".nav a", { y: -6, opacity: 0 }, { y: 0, opacity: 1, duration: .3, stagger: .05, ease:"power2.out", delay: .05 });
    gsap.fromTo(".actions > *", { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: .3, stagger: .06, ease:"power2.out", delay: .12 });

    gsap.fromTo(".pill", { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: .32, ease:"power2.out", delay: .1 });
    gsap.fromTo(".title", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease:"power2.out", delay: .16 });
    gsap.fromTo(".subtitle", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .4, ease:"power2.out", delay: .2 });
    gsap.fromTo(".ctaRow .btn", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .35, stagger: .06, ease:"power2.out", delay: .24 });
    gsap.fromTo(".chips .chip", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .35, stagger: .04, ease:"power2.out", delay: .28 });

    gsap.fromTo(".heroCard", { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .45, ease:"power2.out", delay: .18 });
    gsap.fromTo(".floater", { scale: .9, opacity: 0 }, { scale: 1, opacity: 1, duration: .35, stagger: .08, ease:"power2.out", delay: .4 });
  }

  function scrollAnimations(){
    $$(".section").forEach(sec => {
      gsap.fromTo(sec, { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: .45, ease:"power2.out",
        scrollTrigger: { trigger: sec, start: "top 80%" }
      });
    });
  }

  // ===== Theme & Storage =====
  function loadCart(){
    try{ return JSON.parse(localStorage.getItem("lp_cart") || "{}"); }
    catch{ return {}; }
  }
  function saveCart(c){ localStorage.setItem("lp_cart", JSON.stringify(c)); }

  function loadFavs(){
    try{ return JSON.parse(localStorage.getItem("lp_favs") || "[]"); }
    catch{ return []; }
  }
  function saveFavs(f){ localStorage.setItem("lp_favs", JSON.stringify(f)); }

  function loadTheme(){
    return localStorage.getItem("lp_theme") || "dark";
  }
  function saveTheme(t){ localStorage.setItem("lp_theme", t); }

  function setTheme(t){
    if(t === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
  }

  // ===== Utils =====
  function formatMoney(n){
    // ARS formato simple
    const v = Number(n || 0);
    return "$" + v.toLocaleString("es-AR");
  }

  function niceCategory(cat){
    const map = {
      "pan-nube":"Pan Nube",
      "nubes":"Nubes",
      "tortas":"Tortas",
      "tartas":"Tartas",
      "budines":"Budines",
      "salado":"Salado",
      "otros":"Otros"
    };
    return map[cat] || cat;
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, (m) => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[m]));
  }

})();
