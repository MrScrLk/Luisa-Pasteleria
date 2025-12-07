document.addEventListener("DOMContentLoaded", () => {
  // Año en el footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Scroll suave a secciones del index
  document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-scroll-to");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // WhatsApp: número desde atributo del body
  const body = document.body;
  const whatsappNumber = body.getAttribute("data-whatsapp-number") || "";
  const baseWhatsAppUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : "";

  // Botones generales de WhatsApp (index)
  document.querySelectorAll("[data-whatsapp-general]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!baseWhatsAppUrl) return;
      const text = encodeURIComponent(
        "Hola Luisa 👋, quiero consultar por un pedido (pan nubes / tortas / salado)."
      );
      window.open(`${baseWhatsAppUrl}?text=${text}`, "_blank");
    });
  });

  // Links de WhatsApp por producto (catálogo)
  document
    .querySelectorAll("[data-whatsapp-product]")
    .forEach((link) => {
      const product = link.getAttribute("data-whatsapp-product");
      if (!baseWhatsAppUrl || !product) return;
      const text = encodeURIComponent(
        `Hola Luisa 👋, quiero encargar: ${product}.`
      );
      link.setAttribute("href", `${baseWhatsAppUrl}?text=${text}`);
      link.setAttribute("target", "_blank");
    });

  // Filtros del catálogo
  const filterButtons = document.querySelectorAll("[data-filter]");
  const productCards = document.querySelectorAll(".product-card");

  if (filterButtons.length && productCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter");

        filterButtons.forEach((btn) =>
          btn.classList.toggle("active", btn === button)
        );

        productCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const shouldHide = filter !== "todos" && category !== filter;
          card.classList.toggle("is-hidden", shouldHide);
        });
      });
    });
  }

  // Modal de galería de productos
  const modalBackdrop = document.getElementById("product-modal-backdrop");
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("product-modal-content");
  const closeModalBtn = document.getElementById("close-product-modal");

  const galleries = {
    "pan-nube-clasico": {
      title: "Pan nubes clásicos",
      description:
        "Los pan nubes de siempre: suaves, livianos y esponjosos. Ideales para el mate, el café o el desayuno.",
      images: ["img/pan-nube-1.jpg", "img/pan-nube-2.jpg"],
    },
    "pan-nube-surtido": {
      title: "Pan nubes surtidos",
      description:
        "Bandejas con combinación de nubes dulces y salados: clásicos, especiados, con semillas y más.",
      images: ["img/hero-pan-nubes.JPG", "img/Nubes-simple-1.jpeg"],
    },
    "nubes-cacao": {
      title: "Nubes dulces sabor cacao",
      description:
        "Pan nubes con cacao, una opción dulce pero liviana, perfecta para acompañar el café.",
      images: [
        "img/Nubes-Cacao-dulces-1.jpeg",
        "img/Nubes-Cacao-dulces-2.jpeg",
        "img/Nubes-Cacao-dulces-3.jpeg",
        "img/Nubes-Cacao-dulces-4.jpeg",
      ],
    },
    "nubes-coco": {
      title: "Nubes dulces sabor coco",
      description:
        "Nubes dulces con coco rallado, aromáticos y suaves, ideales para mate, café o meriendas.",
      images: [
        "img/Nubes-coco-1.jpeg",
        "img/Nubes-coco-2.jpeg",
        "img/Nubes-coco-3.jpeg",
      ],
    },
    "nubes-naranja": {
      title: "Nubes dulces sabor naranja",
      description:
        "Nubes con aroma cítrico a naranja, livianos y frescos, ideales para acompañar un té o un café.",
      images: ["img/Nubes-naranja-1.jpeg", "img/Nubes-naranja-2.jpeg"],
    },
    "nubes-semillas": {
      title: "Nubes con semillas",
      description:
        "Pan nubes con mezcla de semillas, una opción distinta y más rústica.",
      images: [
        "img/Nubes-semillas-1.jpeg",
        "img/Nubes-semillas-2.jpeg",
        "img/Nubes-semillas-3.jpeg",
        "img/Nubes-semillas-4.jpeg",
      ],
    },
    "nubes-almendra": {
      title: "Nubes con harina de almendra",
      description:
        "Hechos con harina de almendra, ideales para quienes buscan otras harinas.",
      images: [
        "img/nubes-harina-almendra-1.jpeg",
        "img/nubes-harina-almendra-2.jpeg",
        "img/nubes-harina-almendra-3.jpeg",
        "img/nubes-harina-almendra-4.jpeg",
      ],
    },
    "nubes-simples": {
      title: "Nubes simples",
      description:
        "La base de todas las variantes de pan nubes. Textura suave y liviana, sabor neutro.",
      images: [
        "img/Nubes-simple-1.jpeg",
        "img/Nubes-simple-2.jpeg",
        "img/Nubes-simple-3.jpeg",
        "img/Nubes-simple-4.jpeg",
      ],
    },
    "nubes-pata": {
      title: "Nubes para pata y picadas",
      description:
        "Nubes pensados para acompañar pata, fiambres y picadas. Ligeros pero con sabor.",
      images: [
        "img/Nubes-Pata-1.jpeg",
        "img/Nubes-Pata-2.jpeg",
        "img/Nubes-Pata-3.jpeg",
        "img/Nubes-Pata-4.jpeg",
      ],
    },
    "nubes-lomo": {
      title: "Nubes lomo",
      description:
        "Nubes para armar sándwiches de lomo u otros rellenos, suaves pero firmes.",
      images: [
        "img/Nubes-lomo-1.jpeg",
        "img/Nubes-lomo-2.jpeg",
        "img/Nubes-lomo-3.jpeg",
      ],
    },
    "nubes-especiados": {
      title: "Nubes especiados",
      description:
        "Nubes saborizados con orégano, queso y sabores tipo pizza, perfectos para mesas saladas.",
      images: [
        "img/Nubes-especiados-1.jpeg",
        "img/Nubes-especiados-2.jpeg",
        "img/Nubes-especiados-3.jpeg",
        "img/Nubes-especiados-4.jpeg",
      ],
    },
    "budines-saludables": {
      title: "Budines saludables",
      description:
        "Budines sin harina de trigo y sin azúcar refinada, hechos con harinas como almendra o nuez.",
      images: [
        "img/budines-saludables-1.jpeg",
        "img/budines-saludables-2.jpeg",
        "img/budines-saludables-3.jpeg",
        "img/budines-saludables-4.jpeg",
        "img/budines-saludables-5.jpeg",
        "img/budines-saludables-6.jpeg",
      ],
    },
    cheesecake: {
      title: "Cheesecake",
      description:
        "Cheesecake cremoso con base de galletas y distintas opciones de cobertura.",
      images: ["img/Cheesecake-1.jpeg"],
    },
    "tarta-frutillas": {
      title: "Tarta de frutillas",
      description:
        "Base crocante, crema suave y frutillas frescas. Un clásico que nunca falla.",
      images: ["img/Tarta-frutillas-1.jpeg", "img/Tarta-frutillas-2.jpeg"],
    },
    "tarta-peras-almendras": {
      title: "Tarta de peras y almendras",
      description:
        "Tarta rústica con peras frescas y crema de almendras, para quienes prefieren postres menos dulces.",
      images: ["img/tarta-peras-almendras-1.jpeg"],
    },
    "torta-harina-nuez": {
      title: "Torta con harina de nuez",
      description:
        "Bizcocho húmedo con harina de nuez, sabor intenso y muy aromático.",
      images: [
        "img/torta-harina-nuez-1.jpeg",
        "img/torta-harina-nuez-2.jpeg",
        "img/torta-harina-nuez-3.jpeg",
        "img/torta-harina-nuez-4.jpeg",
      ],
    },
    "torta-selvanegra": {
      title: "Torta selvanegra",
      description:
        "Versión casera de la clásica selvanegra, con capas de bizcochuelo, crema y frutas.",
      images: ["img/Torta-selvanegra-1.jpeg"],
    },
    "torta-cumple": {
      title: "Torta de cumpleaños personalizada",
      description:
        "Tortas decoradas a pedido: sabores, rellenos, colores y estilo adaptados a cada persona.",
      images: ["img/torta-1.JPG"],
    },
    facturas: {
      title: "Medialunas y facturas",
      description:
        "Bandejas de facturas caseras y medialunas suaves. Ideales para desayunos o mesas de café.",
      images: ["img/facturas-1.JPG"],
    },
    "mesa-dulce": {
      title: "Mesa dulce para eventos",
      description:
        "Mesas dulces armadas a medida según cantidad de invitados y tipo de evento.",
      images: ["img/mesa-dulce-1.JPG"],
    },
    "pepas-scones": {
      title: "Pepas y scones",
      description:
        "Pepas caseras y scones para acompañar desayunos, meriendas o mesas de café.",
      images: ["img/Pepas-scones-1.jpeg"],
    },
    chipa: {
      title: "Chipa misionera",
      description:
        "Chipa casera estilo misionero, con mucho queso y textura suave.",
      images: ["img/chipa-1.JPG"],
    },
    focaccias: {
      title: "Focaccias caseras",
      description:
        "Focaccias esponjosas con aceite de oliva, hierbas y diferentes toppings salados.",
      images: [
        "img/Focaccias-1.jpeg",
        "img/Focaccias-2.jpeg",
        "img/Focaccias-3.jpeg",
      ],
    },
    "scones-salados": {
      title: "Scones salados",
      description:
        "Scones salados que acompañan muy bien picadas, sopas y meriendas diferentes.",
      images: ["img/scones-1.JPG"],
    },
  };

  function openModal(productId) {
    if (!modalBackdrop || !modalContent || !galleries[productId]) return;

    const data = galleries[productId];
    const imgsHtml = data.images
      .map(
        (src) =>
          `<figure class="modal-figure"><img src="${src}" alt="${data.title}" loading="lazy"></figure>`
      )
      .join("");

    modalContent.innerHTML = `
      <h2 class="modal-title">${data.title}</h2>
      <p class="modal-text">${data.description}</p>
      <div class="modal-gallery">${imgsHtml}</div>
    `;

    modalBackdrop.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  if (modalBackdrop && modalContent) {
    document.querySelectorAll("[data-product-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-product-id");
        if (id) openModal(id);
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalBackdrop.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

});

// ==========================================
// BOTÓN VOLVER ARRIBA
// ==========================================
(function () {
  function killOldButtons() {
    // borra por id
    const oldById = document.getElementById("back-to-top");
    if (oldById) oldById.remove();

    // borra por clase
    document.querySelectorAll(".back-to-top").forEach(b => b.remove());
  }

  function createNewButton() {
    const btn = document.createElement("button");
    btn.id = "luisa-btt";
    btn.type = "button";
    btn.setAttribute("aria-label", "Volver arriba");
    btn.textContent = "🧁";

    // Estilos INLINE para que sea imposible que quede a la izquierda
    btn.style.position = "fixed";
    btn.style.right = "22px";
    btn.style.bottom = "22px";
    btn.style.left = "auto";
    btn.style.zIndex = "999999";
    btn.style.width = "56px";
    btn.style.height = "56px";
    btn.style.borderRadius = "18px";
    btn.style.border = "0";
    btn.style.cursor = "pointer";
    btn.style.display = "grid";
    btn.style.placeItems = "center";
    btn.style.fontSize = "24px";
    btn.style.boxShadow = "0 18px 40px rgba(255,47,146,.35), 0 8px 18px rgba(0,0,0,.12)";
    btn.style.background = "linear-gradient(135deg, #ff2f92, #ff7ad9, #ff5d5d)";
    btn.style.color = "#fff";
    btn.style.opacity = "0";
    btn.style.transform = "translateY(10px) scale(.95)";
    btn.style.transition = "opacity .25s ease, transform .25s ease, filter .2s ease";

    // Hover lindo
    btn.addEventListener("mouseenter", () => {
      btn.style.filter = "brightness(1.08) saturate(1.1)";
      btn.style.transform = "translateY(-2px) scale(1.04)";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.filter = "";
      // vuelve según estado visible
      btn.style.transform = btn.dataset.visible === "1"
        ? "translateY(0) scale(1)"
        : "translateY(10px) scale(.95)";
    });

    // Click = subir + mini pop
    btn.addEventListener("click", () => {
      btn.style.transform = "translateY(-2px) scale(.96)";
      setTimeout(() => {
        btn.style.transform = "translateY(0) scale(1)";
      }, 120);

      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    document.body.appendChild(btn);
    return btn;
  }

  function init() {
    killOldButtons();
    const btn = createNewButton();

    const toggle = () => {
      if (window.scrollY > 240) {
        btn.style.opacity = "1";
        btn.style.transform = "translateY(0) scale(1)";
        btn.style.pointerEvents = "auto";
        btn.dataset.visible = "1";
      } else {
        btn.style.opacity = "0";
        btn.style.transform = "translateY(10px) scale(.95)";
        btn.style.pointerEvents = "none";
        btn.dataset.visible = "0";
      }
    };

    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


// ==========================================
// BOTÓN INSTAGRAM FLOTANTE
// ==========================================
(function () {
  const IG_USER = "luisapasteleria";
  const IG_URL = `https://www.instagram.com/luisapasteleria/${IG_USER}`;

  
  if (document.getElementById("luisa-ig-float")) return;

  const btn = document.createElement("a");
  btn.id = "luisa-ig-float";
  btn.href = IG_URL;
  btn.target = "_blank";
  btn.rel = "noopener noreferrer";
  btn.setAttribute("aria-label", "Instagram de Luisa Pastelería");
  btn.title = "Instagram";

  // Logo con estilo emoji-ready y universal
  btn.innerHTML = "📸";

  // Estilos inline
  btn.style.position = "fixed";
  btn.style.right = "22px";
  btn.style.bottom = "92px"; // arriba del botón volver arriba
  btn.style.zIndex = "999999";
  btn.style.width = "56px";
  btn.style.height = "56px";
  btn.style.borderRadius = "18px";
  btn.style.display = "grid";
  btn.style.placeItems = "center";
  btn.style.textDecoration = "none";
  btn.style.fontSize = "24px";
  btn.style.color = "#fff";
  btn.style.background =
    "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)";
  btn.style.boxShadow =
    "0 18px 40px rgba(221,42,123,.35), 0 8px 18px rgba(0,0,0,.12)";
  btn.style.transform = "translateY(0) scale(1)";
  btn.style.transition = "transform .2s ease, filter .2s ease, box-shadow .2s ease";
  btn.style.cursor = "pointer";

  // Animación suave de flotación
  btn.animate(
    [
      { transform: "translateY(0) scale(1)" },
      { transform: "translateY(-4px) scale(1.01)" },
      { transform: "translateY(0) scale(1)" }
    ],
    { duration: 2800, iterations: Infinity, easing: "ease-in-out" }
  );

  // Hover más “Instagram”
  btn.addEventListener("mouseenter", () => {
    btn.style.filter = "brightness(1.08) saturate(1.12)";
    btn.style.transform = "translateY(-2px) scale(1.05)";
    btn.style.boxShadow =
      "0 22px 48px rgba(221,42,123,.45), 0 10px 22px rgba(0,0,0,.14)";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.filter = "";
    btn.style.transform = "translateY(0) scale(1)";
    btn.style.boxShadow =
      "0 18px 40px rgba(221,42,123,.35), 0 8px 18px rgba(0,0,0,.12)";
  });

  document.body.appendChild(btn);

  // Ajuste mobile
  const mq = window.matchMedia("(max-width: 600px)");
  const applyMobile = () => {
    if (mq.matches) {
      btn.style.width = "48px";
      btn.style.height = "48px";
      btn.style.right = "14px";
      btn.style.bottom = "76px";
      btn.style.borderRadius = "14px";
      btn.style.fontSize = "22px";
    } else {
      btn.style.width = "56px";
      btn.style.height = "56px";
      btn.style.right = "22px";
      btn.style.bottom = "92px";
      btn.style.borderRadius = "18px";
      btn.style.fontSize = "24px";
    }
  };
  applyMobile();
  mq.addEventListener?.("change", applyMobile);
})();



