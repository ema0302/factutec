/**
 * FACTUTEC - Simulador Interactivo de Punto de Venta & Dashboard
 * Experiencia interactiva para que el visitante pruebe la velocidad del sistema.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Sample Product Catalog for POS simulator
  const CATALOG = [
    { id: 101, name: "Yerba Mate 1kg Especial", price: 3450, code: "77901234", category: "Almacén", icon: "🧉" },
    { id: 102, name: "Gaseosa Cola 1.5L", price: 2100, code: "77904561", category: "Bebidas", icon: "🥤" },
    { id: 103, name: "Aceite Girasol 900ml", price: 1890, code: "77907892", category: "Almacén", icon: "🌻" },
    { id: 104, name: "Tornillos Autoperforantes x50", price: 2400, code: "77903215", category: "Ferretería", icon: "🔩" },
    { id: 105, name: "Cerveza Andes Origen 1L", price: 2800, code: "77906548", category: "Bebidas", icon: "🍺" },
    { id: 106, name: "Cuaderno Tapa Dura A4", price: 4200, code: "77909873", category: "Librería", icon: "📓" },
    { id: 107, name: "Harina 0000 1kg Ultra", price: 1150, code: "77901472", category: "Almacén", icon: "🌾" },
    { id: 108, name: "Cinta Aislante Negra 20m", price: 1300, code: "77902583", category: "Ferretería", icon: "⚡" }
  ];

  let cart = [
    { ...CATALOG[0], qty: 1 },
    { ...CATALOG[1], qty: 2 }
  ];

  let selectedPayment = "efectivo";
  let invoiceCounter = 4892;

  // DOM Elements
  const catalogGrid = document.getElementById("pos-catalog-grid");
  const cartItemsList = document.getElementById("pos-cart-items");
  const subtotalElem = document.getElementById("pos-subtotal");
  const totalElem = document.getElementById("pos-total");
  const emitTicketBtn = document.getElementById("pos-emit-ticket-btn");
  const clearCartBtn = document.getElementById("pos-clear-cart-btn");
  const receiptContainer = document.getElementById("pos-receipt-output");
  const paymentButtons = document.querySelectorAll(".pos-payment-btn");
  const barcodeInput = document.getElementById("pos-barcode-input");

  // Render Product Catalog
  function renderCatalog() {
    if (!catalogGrid) return;
    catalogGrid.innerHTML = CATALOG.map(
      (prod) => `
      <button class="pos-prod-btn" data-prod-id="${prod.id}" title="Click para agregar ${prod.name}">
        <span class="pos-prod-icon">${prod.icon}</span>
        <div class="pos-prod-info">
          <span class="pos-prod-name">${prod.name}</span>
          <span class="pos-prod-code">Cód: ${prod.code}</span>
        </div>
        <span class="pos-prod-price">$${prod.price.toLocaleString("es-AR")}</span>
      </button>
    `
    ).join("");

    catalogGrid.querySelectorAll(".pos-prod-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = parseInt(btn.dataset.prodId, 10);
        addProductToCart(id);
      });
    });
  }

  // Add Product to Cart
  function addProductToCart(prodId) {
    const existing = cart.find((item) => item.id === prodId);
    if (existing) {
      existing.qty += 1;
    } else {
      const prod = CATALOG.find((p) => p.id === prodId);
      if (prod) cart.push({ ...prod, qty: 1 });
    }
    renderCart();
    highlightCart();
  }

  // Render Cart Items
  function renderCart() {
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="pos-empty-cart">
          <span>🛒</span>
          <p>El carrito está vacío. Hacé clic en los productos para agregarlos.</p>
        </div>
      `;
      if (subtotalElem) subtotalElem.textContent = "$0";
      if (totalElem) totalElem.textContent = "$0";
      if (emitTicketBtn) emitTicketBtn.disabled = true;
      return;
    }

    if (emitTicketBtn) emitTicketBtn.disabled = false;

    let subtotal = 0;
    cartItemsList.innerHTML = cart
      .map((item, idx) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        return `
        <div class="pos-cart-row">
          <div class="pos-cart-name">
            <strong>${item.name}</strong>
            <small>$${item.price.toLocaleString("es-AR")} c/u</small>
          </div>
          <div class="pos-cart-qty-ctrl">
            <button class="btn-qty btn-minus" data-idx="${idx}">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="btn-qty btn-plus" data-idx="${idx}">+</button>
          </div>
          <div class="pos-cart-price">
            $${itemTotal.toLocaleString("es-AR")}
          </div>
          <button class="btn-remove-item" data-idx="${idx}" title="Quitar">×</button>
        </div>
      `;
      })
      .join("");

    if (subtotalElem) subtotalElem.textContent = `$${subtotal.toLocaleString("es-AR")}`;
    if (totalElem) totalElem.textContent = `$${subtotal.toLocaleString("es-AR")}`;

    // Attach row events
    cartItemsList.querySelectorAll(".btn-plus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        cart[idx].qty += 1;
        renderCart();
      });
    });

    cartItemsList.querySelectorAll(".btn-minus").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        if (cart[idx].qty > 1) {
          cart[idx].qty -= 1;
        } else {
          cart.splice(idx, 1);
        }
        renderCart();
      });
    });

    cartItemsList.querySelectorAll(".btn-remove-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        cart.splice(idx, 1);
        renderCart();
      });
    });
  }

  function highlightCart() {
    const box = document.querySelector(".pos-cart-container");
    if (box) {
      box.classList.add("cart-pulse");
      setTimeout(() => box.classList.remove("cart-pulse"), 300);
    }
  }

  // Payment Selection
  paymentButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      paymentButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedPayment = btn.dataset.payment || "efectivo";
    });
  });

  // Barcode search simulation
  if (barcodeInput) {
    barcodeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const val = barcodeInput.value.trim();
        if (!val) return;
        const match = CATALOG.find((p) => p.code.includes(val) || p.name.toLowerCase().includes(val.toLowerCase()));
        if (match) {
          addProductToCart(match.id);
          barcodeInput.value = "";
        } else {
          barcodeInput.classList.add("input-error");
          setTimeout(() => barcodeInput.classList.remove("input-error"), 800);
        }
      }
    });
  }

  // Emit Ticket Simulation
  if (emitTicketBtn) {
    emitTicketBtn.addEventListener("click", () => {
      if (cart.length === 0) return;

      invoiceCounter += 1;
      const now = new Date();
      const dateStr = now.toLocaleDateString("es-AR");
      const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
      const subtotalNeto = Math.round(total / 1.21);
      const iva = total - subtotalNeto;
      const cae = "74289104829381";
      const caeVto = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("es-AR");

      const paymentNames = {
        efectivo: "EFECTIVO (Cobro Inmediato)",
        mp: "MERCADO PAGO / QR DINÁMICO",
        tarjeta: "TARJETA DÉBITO / CRÉDITO",
        cta_cte: "CUENTA CORRIENTE CLIENTE"
      };

      // Trigger Confetti Burst
      if (typeof window.triggerConfetti === "function") {
        const rect = emitTicketBtn.getBoundingClientRect();
        window.triggerConfetti(rect.left + rect.width / 2, rect.top);
      }

      if (!receiptContainer) return;

      receiptContainer.innerHTML = `
        <div class="thermal-receipt animate-print">
          <div class="receipt-header">
            <div class="receipt-logo">FACTUTEC</div>
            <div class="receipt-subtitle">SOFTWARE & FACTURACIÓN</div>
            <p>FACTUTEC S.A.S. - MENDOZA</p>
            <p>CUIT: 30-71829402-8 • IVA RESPONSABLE INSCRIPTO</p>
            <p>San Martín, Mendoza - Tel: 2634588805</p>
            <div class="receipt-divider">--------------------------------</div>
            <div class="receipt-type">FACTURA 'B' • N° 0004-0000${invoiceCounter}</div>
            <p class="receipt-date">Fecha: ${dateStr} ${timeStr}</p>
            <p>P.Venta: 0004 • Factura Electrónica ARCA</p>
            <div class="receipt-divider">--------------------------------</div>
          </div>

          <div class="receipt-body">
            <div class="receipt-items-head">
              <span>CANT / DETALLE</span>
              <span>TOTAL</span>
            </div>
            ${cart
              .map(
                (item) => `
              <div class="receipt-item-row">
                <div class="receipt-item-name">
                  <strong>${item.qty}x ${item.name}</strong>
                  <small>($${item.price.toLocaleString("es-AR")} c/u)</small>
                </div>
                <div class="receipt-item-sum">$${(item.price * item.qty).toLocaleString("es-AR")}</div>
              </div>
            `
              )
              .join("")}
            <div class="receipt-divider">--------------------------------</div>
            <div class="receipt-subtotal-row">
              <span>Importe Neto:</span>
              <span>$${subtotalNeto.toLocaleString("es-AR")}</span>
            </div>
            <div class="receipt-subtotal-row">
              <span>IVA (21%):</span>
              <span>$${iva.toLocaleString("es-AR")}</span>
            </div>
            <div class="receipt-total-row">
              <span>TOTAL:</span>
              <span>$${total.toLocaleString("es-AR")}</span>
            </div>
            <div class="receipt-payment-row">
              <span>Forma de Pago:</span>
              <strong>${paymentNames[selectedPayment] || "EFECTIVO"}</strong>
            </div>
          </div>

          <div class="receipt-footer">
            <div class="receipt-divider">--------------------------------</div>
            <div class="receipt-cae-box">
              <p><strong>CAE:</strong> ${cae}</p>
              <p><strong>Vto. CAE:</strong> ${caeVto}</p>
              <div class="receipt-qr-sim">
                <div class="qr-mock">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="#000">
                    <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v4h-4v-4zm-4 4h4v2h-4v-2zm-2-4h2v2h-2v-2zm2-2h4v2h-4v-2zm-2-2h2v2h-2v-2z"/>
                  </svg>
                </div>
                <span>Comprobante Autorizado por ARCA (ex AFIP)</span>
              </div>
            </div>
            <p class="receipt-thanks">¡Gracias por su compra!</p>
            <p class="receipt-brand">Sistema FACTUTEC • Licencia de por vida</p>
          </div>
        </div>
      `;

      // Trigger celebration / success feedback
      emitTicketBtn.innerHTML = `<span>✅ ¡Ticket Emitido con Éxito!</span>`;
      emitTicketBtn.classList.add("btn-success");

      setTimeout(() => {
        emitTicketBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
          <span>Emitir Ticket Fiscal ARCA</span>
        `;
        emitTicketBtn.classList.remove("btn-success");
      }, 2500);
    });
  }

  // Clear Cart
  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      cart = [];
      renderCart();
    });
  }

  // Initial calls
  renderCatalog();
  renderCart();
});
