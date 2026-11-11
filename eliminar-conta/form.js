const form = document.querySelector("#deletion-request");
const status = document.querySelector("#request-status");
const button = form.querySelector("button");
const type = form.elements.namedItem("type");
const clinic = form.elements.namedItem("clinic");
const clinicLabel = document.querySelector("#clinic-label");
const endpoint = "https://djeijlkqypvaznmlvtxe.supabase.co/functions/v1/fisio-account-deletion";

function syncClinic() {
  clinic.required = type.value === "clinic";
  clinicLabel.textContent = clinic.required ? "Nome da clínica" : "Nome da clínica (se aplicável)";
}

function showStatus(message, state) {
  status.textContent = message;
  status.dataset.state = state;
}

type.addEventListener("change", syncClinic);
form.addEventListener("submit", async event => {
  event.preventDefault();
  if (button.disabled) return;
  button.disabled = true;
  showStatus("A enviar o pedido…", "pending");
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
      signal: AbortSignal.timeout(35000),
    });
    const result = await response.json();
    if (!response.ok) {
      showStatus(result.message || "Não foi possível enviar o pedido.", "error");
    } else {
      showStatus(result.message, "success");
      form.reset();
      syncClinic();
    }
  } catch {
    showStatus("Não foi possível confirmar o envio. Tente novamente mais tarde ou contacte geral@aqlfisio.com.", "error");
  } finally {
    button.disabled = false;
    status.focus();
  }
});
syncClinic();
form.hidden = false;
