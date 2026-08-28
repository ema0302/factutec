/**
 * FACTUTEC - Filtrado y Showcase de Clientes
 * Inspirado en KeySistemas + Tarjetas Collage Figma 2026
 */

function initClientsFilter() {
  const clientsGrid = document.getElementById("clients-grid");
  const filterPills = document.querySelectorAll(".client-filter-pill");
  const searchInput = document.getElementById("client-search-input");
  const clientsCountBadge = document.getElementById("clients-count-badge");
  const clientModal = document.getElementById("client-detail-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  if (!clientsGrid) return;

  let currentCategory = "todos";
  let searchQuery = "";

  // Render client card HTML
  function renderClients() {
    const filtered = CLIENTS_DATA.filter((client) => {
      const matchCategory =
        currentCategory === "todos" || client.category === currentCategory;
      const matchSearch =
        !searchQuery ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.systemInstalled.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    // Update count badge
    if (clientsCountBadge) {
      clientsCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? "cliente" : "clientes"}`;
    }

    if (filtered.length === 0) {
      clientsGrid.innerHTML = `
        <div class="no-clients-found">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron comercios con esa búsqueda</h3>
          <p>Probá con otro término o seleccioná "Todos" los rubros.</p>
          <button class="btn btn-secondary btn-sm" id="reset-filter-btn">Ver todos los clientes</button>
        </div>
      `;
      const resetBtn = document.getElementById("reset-filter-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          currentCategory = "todos";
          searchQuery = "";
          if (searchInput) searchInput.value = "";
          filterPills.forEach((p) => p.classList.remove("active"));
          document.querySelector('[data-category="todos"]')?.classList.add("active");
          renderClients();
        });
      }
      return;
    }

    clientsGrid.innerHTML = filtered
      .map(
        (client, index) => `
      <div class="client-card collage-card" data-client-id="${client.id}" style="--accent: ${client.logoColor}; --accent-bg: ${client.logoBg}; animation-delay: ${index * 0.04}s">
        <!-- Accent Top Bar -->
        <div class="card-accent-bar" style="background: ${client.logoColor}"></div>
        
        <!-- Header: Emblem Logo + Category -->
        <div class="client-card-header">
          <div class="client-emblem" style="background: ${client.logoBg}; color: ${client.logoColor}; border-color: ${client.logoColor}30">
            ${
              client.logoImage
                ? `<img src="${client.logoImage}" alt="${client.name}">`
                : `<span>${client.logoText}</span>`
            }
          </div>
          <div class="client-meta">
            <span class="client-badge" style="background: ${client.logoBg}; color: ${client.logoColor}">
              ${client.categoryName}
            </span>
            <span class="client-location">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${client.location}
            </span>
          </div>
        </div>

        <!-- Body -->
        <div class="client-card-body">
          <h3 class="client-title">${client.name}</h3>
          
          <div class="client-tech-box">
            <div class="tech-row">
              <span class="icon-bubble bubble-xs bubble-emerald"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span>
              <span class="tech-label">Sistema:</span>
              <strong class="tech-val">${client.systemInstalled}</strong>
            </div>
            <div class="tech-row">
              <span class="icon-bubble bubble-xs bubble-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M7 17h.01"></path><path d="M17 17h.01"></path></svg></span>
              <span class="tech-label">Puestos:</span>
              <span class="tech-val">${client.hardware}</span>
            </div>
          </div>

          <p class="client-highlight">"${client.highlight}"</p>
        </div>

        <!-- Footer / Action -->
        <div class="client-card-footer">
          <div class="client-stars" title="${client.rating} estrellas">
            ${"★".repeat(client.rating)}
          </div>
          <button class="btn-view-client" data-id="${client.id}" aria-label="Ver detalles de ${client.name}">
            <span>Ver Ficha</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `
      )
      .join("");

    // Attach click listeners to cards
    document.querySelectorAll(".btn-view-client, .client-card").forEach((elem) => {
      elem.addEventListener("click", (e) => {
        const id = elem.dataset.clientId || elem.dataset.id;
        if (id) openClientModal(id);
      });
    });
  }

  // Filter Pills click handler
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      currentCategory = pill.dataset.category || "todos";
      renderClients();
    });
  });

  // Search input handler with debounce
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        searchQuery = e.target.value.trim();
        renderClients();
      }, 150);
    });
  }

  // Modal open function
  function openClientModal(clientId) {
    const client = CLIENTS_DATA.find((c) => c.id === clientId);
    if (!client || !clientModal) return;

    const modalBody = document.getElementById("modal-client-content");
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="card-accent-bar" style="background: ${client.logoColor}; height: 5px; width: 100%;"></div>
        <div class="modal-header-hero" style="background: linear-gradient(135deg, ${client.logoColor}30 0%, ${client.logoBg} 50%, #f1f5f9 100%); border-bottom: 1px solid #e2e8f0;">
          <div class="modal-emblem" style="background: ${client.logoBg}; color: ${client.logoColor}; border-color: ${client.logoColor}50; box-shadow: 0 4px 16px ${client.logoColor}35;">
            ${
              client.logoImage
                ? `<img src="${client.logoImage}" alt="${client.name}">`
                : client.logoText
            }
          </div>
          <div>
            <span class="modal-tag" style="background: ${client.logoColor}; color: #ffffff; font-weight: 700; box-shadow: 0 2px 8px ${client.logoColor}40;">${client.categoryName}</span>
            <h2 class="modal-client-title" style="color: #0f172a; margin: 0.35rem 0 0.35rem; font-weight: 800; font-size: 1.6rem;">${client.name}</h2>
            <p class="modal-location" style="color: #334155; font-weight: 600; font-size: 0.9rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              ${client.location} • <span style="color: #0369a1; font-weight: 700;">Cliente desde ${client.year}</span>
            </p>
          </div>
        </div>

        <div class="modal-details-grid">
          <div class="detail-box">
            <h4 style="display: flex; align-items: center; gap: 0.45rem;"><span class="icon-bubble bubble-xs bubble-emerald"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></span> Sistema Implementado</h4>
            <p><strong>${client.systemInstalled}</strong></p>
            <small>Homologación fiscal ARCA oficial + modo 100% offline</small>
          </div>
          <div class="detail-box">
            <h4 style="display: flex; align-items: center; gap: 0.45rem;"><span class="icon-bubble bubble-xs bubble-blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M7 7h.01"></path><path d="M17 7h.01"></path><path d="M7 17h.01"></path><path d="M17 17h.01"></path></svg></span> Configuración de Hardware</h4>
            <p>${client.hardware}</p>
            <small>Instalado y configurado en el local por FACTUTEC</small>
          </div>
          <div class="detail-box">
            <h4 style="display: flex; align-items: center; gap: 0.45rem;"><span class="icon-bubble bubble-xs bubble-purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path></svg></span> Clave del Negocio</h4>
            <p>${client.highlight}</p>
          </div>
          <div class="detail-box">
            <h4 style="display: flex; align-items: center; gap: 0.45rem;"><span class="icon-bubble bubble-xs bubble-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></span> Calificación del Servicio</h4>
            <div class="modal-stars">${"★".repeat(client.rating)} (5/5)</div>
            <p class="modal-quote">"${client.testimonial}"</p>
          </div>
        </div>

        <div class="modal-cta-box">
          <p>¿Tu negocio es de un rubro similar? Podemos instalar el mismo sistema adaptado a vos.</p>
          <a href="https://wa.me/5492634588805?text=Hola%20FactuTec!%20Vi%20el%20caso%20de%20éxito%20de%20${encodeURIComponent(client.name)}%20y%20quiero%20consultar%20por%20un%20sistema%20similar%20para%20mi%20negocio" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">
            Consultar por WhatsApp para mi negocio
          </a>
        </div>
      `;
    }

    clientModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  // Close modal
  function closeModal() {
    if (!clientModal) return;
    clientModal.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (clientModal) {
    clientModal.addEventListener("click", (e) => {
      if (e.target === clientModal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && clientModal?.classList.contains("active")) {
      closeModal();
    }
  });

  // Initial render
  renderClients();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initClientsFilter);
} else {
  initClientsFilter();
}
