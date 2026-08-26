/**
 * FACTUTEC - Cotizador Oficial de Planes FACTUVENTAS
 * 
 * Lista de Precios Oficial:
 * - Básico: $150.000
 * - Avanzado + App Teléfono: $250.000
 * - Avanzado + App Teléfono + Facturación Automática con ARCA: $400.000
 * 
 * Se paga una sola vez y queda activado de por vida.
 * Vigencia del precio por 15 días.
 * 
 * Contacto: Joel Guevara (2634588805)
 */

document.addEventListener("DOMContentLoaded", () => {
  const planSelector = document.getElementById("calc-plan-type");
  const businessTypeSelect = document.getElementById("calc-business-type");
  const terminalsCountSelect = document.getElementById("calc-terminals-count");
  const addonCheckboxes = document.querySelectorAll(".calc-addon-check");
  const summaryBox = document.getElementById("calc-summary-output");
  const sendWhatsappBtn = document.getElementById("calc-send-whatsapp-btn");

  const PHONE_NUMBER = "5492634588805"; // Joel Guevara

  const PLANS = {
    basico: {
      name: "FACTUVENTAS BÁSICO",
      price: 150000,
      description: "Gestión de inventario, ventas rápidas, cortes de caja, básculas, cajeros y 100% offline. Monocaja.",
      badge: "PAGO ÚNICO: $150.000"
    },
    avanzado_app: {
      name: "FACTUVENTAS AVANZADO + APP TELÉFONO",
      price: 250000,
      description: "Incluye todo lo del Básico + Sincronización en tiempo real multi-caja, gestión de cajas, mantenimiento centralizado y monitoreo remoto desde la app móvil.",
      badge: "PAGO ÚNICO: $250.000"
    },
    avanzado_app_arca: {
      name: "FACTUVENTAS AVANZADO + APP + FACTURACIÓN ARCA",
      price: 400000,
      description: "El paquete más completo. Incluye Básico + Avanzado + App Móvil + Facturación electrónica automática con ARCA (ex AFIP) en cada venta con CAE y QR oficial.",
      badge: "PAGO ÚNICO: $400.000 (MÁS ELEGIDO)"
    }
  };

  const EXTRA_TERMINAL_PRICE = 35000; // Por puesto de red adicional más allá de 2

  function calculateQuote() {
    if (!planSelector) return;

    const selectedPlanKey = planSelector.value || "avanzado_app_arca";
    const planInfo = PLANS[selectedPlanKey] || PLANS.avanzado_app_arca;
    const terminals = parseInt(terminalsCountSelect ? terminalsCountSelect.value : "1", 10) || 1;

    let subtotal = planInfo.price;

    // Si es un plan avanzado con más de 2 terminales en red
    if ((selectedPlanKey === "avanzado_app" || selectedPlanKey === "avanzado_app_arca") && terminals > 2) {
      subtotal += (terminals - 2) * EXTRA_TERMINAL_PRICE;
    }

    const selectedAddons = [];
    addonCheckboxes.forEach((chk) => {
      if (chk.checked) {
        const addonPrice = parseInt(chk.dataset.price, 10) || 0;
        subtotal += addonPrice;
        selectedAddons.push({
          name: chk.dataset.name,
          price: addonPrice
        });
      }
    });

    // Update UI Summary Box
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div class="calc-summary-card">
          <div class="calc-badge-license">${planInfo.badge}</div>
          
          <div class="calc-summary-header">
            <div>
              <h3>${planInfo.name}</h3>
              <p style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">${planInfo.description}</p>
            </div>
            <span class="calc-terminals-badge">${terminals} ${terminals === 1 ? "Puesto de Caja" : "Cajas en Red"}</span>
          </div>

          <div class="calc-summary-breakdown">
            <div class="calc-item-line">
              <span>Licencia Oficial FactuVentas:</span>
              <strong>$${planInfo.price.toLocaleString("es-AR")}</strong>
            </div>

            ${
              (selectedPlanKey === "avanzado_app" || selectedPlanKey === "avanzado_app_arca") && terminals > 2
                ? `
            <div class="calc-item-line">
              <span>${terminals - 2} Caja(s) Adicional(es) en Red:</span>
              <strong>$${((terminals - 2) * EXTRA_TERMINAL_PRICE).toLocaleString("es-AR")}</strong>
            </div>
            `
                : ""
            }

            ${selectedAddons
              .map(
                (ad) => `
              <div class="calc-item-line">
                <span>+ ${ad.name}:</span>
                <strong>${ad.price > 0 ? `$${ad.price.toLocaleString("es-AR")}` : "¡INCLUIDO!"}</strong>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="calc-total-box">
            <div class="calc-total-label">
              <span>Inversión Total (Pago Único):</span>
              <small>Se paga una sola vez y queda activado de por vida</small>
            </div>
            <div class="calc-total-amount">$${subtotal.toLocaleString("es-AR")}</div>
          </div>

          <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.8rem; color: #c2410c; font-weight: 700; display: flex; align-items: center; gap: 0.5rem;">
            <span class="icon-bubble bubble-xs bubble-orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></span>
            <span>Vigencia del precio congelado por 15 días.</span>
          </div>

          <div class="calc-perks-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;"><span class="icon-bubble bubble-xs bubble-emerald"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Licencia activada de por vida (Sin mensualidades)</div>
            <div style="display: flex; align-items: center; gap: 0.5rem;"><span class="icon-bubble bubble-xs bubble-emerald"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Instalación y capacitación inicial por Joel y Emanuel</div>
            <div style="display: flex; align-items: center; gap: 0.5rem;"><span class="icon-bubble bubble-xs bubble-emerald"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg></span> Operación 100% Offline garantizada</div>
            <div style="display: flex; align-items: center; gap: 0.5rem;"><span class="icon-bubble bubble-xs bubble-sky"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg></span> Soporte Técnico Postventa: Opcional ($30.000 / mes)</div>
          </div>
        </div>
      `;
    }

    // Build WhatsApp message
    if (sendWhatsappBtn) {
      let msg = `Hola Joel y Emanuel (FACTUTEC)! Estuve usando el cotizador de la web y quiero consultar para congelar el precio de la siguiente versión de FACTUVENTAS:\n\n`;
      msg += `📦 *Versión:* ${planInfo.name} ($${planInfo.price.toLocaleString("es-AR")})\n`;
      msg += `🏷️ *Rubro:* ${businessTypeSelect ? businessTypeSelect.options[businessTypeSelect.selectedIndex].text : "Comercio"}\n`;
      msg += `🖥️ *Cantidad de Puestos:* ${terminals}\n`;
      if (selectedAddons.length > 0) {
        msg += `⚙️ *Adicionales / Servicios Opcionales:*\n`;
        selectedAddons.forEach((a) => {
          msg += `   • ${a.name} ${a.price > 0 ? `(+$${a.price.toLocaleString("es-AR")})` : "(Incluido)"}\n`;
        });
      }
      msg += `\n💰 *Total Presupuesto:* $${subtotal.toLocaleString("es-AR")} (Pago Único)\n`;
      msg += `⏳ *Nota:* Consulto dentro de la vigencia de 15 días.\n\n`;
      msg += `¿Cuándo podemos coordinar la demostración o instalación en mi negocio?`;

      const encoded = encodeURIComponent(msg);
      sendWhatsappBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${encoded}`;
    }
  }

  // Event Listeners
  if (planSelector) planSelector.addEventListener("change", calculateQuote);
  if (businessTypeSelect) businessTypeSelect.addEventListener("change", calculateQuote);
  if (terminalsCountSelect) terminalsCountSelect.addEventListener("change", calculateQuote);
  addonCheckboxes.forEach((chk) => {
    chk.addEventListener("change", calculateQuote);
  });

  // Initial calculation
  calculateQuote();
});

