import { NUMERO_WHATSAPP } from "./config.js";
import { formatearPrecio } from "./funciones.js";
import {
  generarTextoTicket,
  generarUrlWhatsApp,
} from "./confirmacionFunciones.js";

const seccionSinPedido = document.getElementById("sin-pedido");
const seccionTicket = document.getElementById("ticket-seccion");

const ticketOrden = document.getElementById("ticket-orden");
const ticketFecha = document.getElementById("ticket-fecha");
const ticketClienteNombre = document.getElementById("ticket-cliente-nombre");
const ticketClienteEmail = document.getElementById("ticket-cliente-email");
const ticketClienteTelefono = document.getElementById("ticket-cliente-telefono");
const ticketEntregaMetodo = document.getElementById("ticket-entrega-metodo");
const ticketEntregaDireccion = document.getElementById(
  "ticket-entrega-direccion"
);
const ticketPagoTarjeta = document.getElementById("ticket-pago-tarjeta");
const ticketItems = document.getElementById("ticket-items");
const ticketSubtotal = document.getElementById("ticket-subtotal");
const ticketEnvio = document.getElementById("ticket-envio");
const ticketTotal = document.getElementById("ticket-total");

const btnCopiarTicket = document.getElementById("btn-copiar-ticket");
const btnEnviarWhatsapp = document.getElementById("btn-enviar-whatsapp");
const notificacionAccion = document.getElementById("notificacion-accion");

function obtenerUltimoPedido() {
  try {
    const datos = localStorage.getItem("ultimoPedido");
    return datos ? JSON.parse(datos) : null;
  } catch (error) {
    console.error("Error al leer el pedido guardado:", error);
    return null;
  }
}

function mostrarNotificacion(texto) {
  if (!notificacionAccion) return;
  notificacionAccion.textContent = texto;
  notificacionAccion.hidden = false;
}

function copiarTextoFallback(texto) {
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

const pedido = obtenerUltimoPedido();

if (!pedido) {
  seccionSinPedido.hidden = false;
  seccionTicket.hidden = true;
} else {
  seccionSinPedido.hidden = true;
  seccionTicket.hidden = false;

  ticketOrden.textContent = pedido.numeroOrden;
  ticketFecha.textContent = `Fecha: ${pedido.fecha}`;
  ticketClienteNombre.textContent = `Nombre: ${pedido.cliente.nombre}`;
  ticketClienteEmail.textContent = `Email: ${pedido.cliente.email}`;
  ticketClienteTelefono.textContent = `Teléfono: ${pedido.cliente.telefono}`;

  ticketEntregaMetodo.textContent =
    pedido.entrega.metodo === "envio"
      ? "Método: Envío a domicilio"
      : "Método: Retiro en el local";
  ticketEntregaDireccion.textContent = `Dirección: ${pedido.entrega.direccion}, ${pedido.entrega.localidad} (CP ${pedido.entrega.codigoPostal})`;
  ticketPagoTarjeta.textContent = `Tarjeta: •••• ${pedido.pago.ultimosDigitos} (${pedido.pago.titular})`;

  let itemsHTML = "";
  pedido.items.forEach((item) => {
    itemsHTML += `
      <div class="ticket-item">
        <div>
          <strong>${item.nombre}</strong>
          <span> × ${item.cantidad}</span>
        </div>
        <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
      </div>`;
  });
  ticketItems.innerHTML = itemsHTML;

  ticketSubtotal.textContent = formatearPrecio(pedido.subtotal);
  ticketEnvio.textContent =
    pedido.entrega.costoEnvio === 0
      ? "Gratis"
      : formatearPrecio(pedido.entrega.costoEnvio);
  ticketTotal.textContent = formatearPrecio(pedido.total);

  if (btnEnviarWhatsapp) {
    btnEnviarWhatsapp.href = generarUrlWhatsApp(pedido, NUMERO_WHATSAPP);
    btnEnviarWhatsapp.addEventListener("click", () => {
      mostrarNotificacion("Abriendo WhatsApp con el detalle de tu pedido...");
    });
  }

  if (btnCopiarTicket) {
    btnCopiarTicket.addEventListener("click", async () => {
      const textoTicket = generarTextoTicket(pedido);

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textoTicket);
        } else {
          copiarTextoFallback(textoTicket);
        }
        btnCopiarTicket.textContent = "¡Copiado!";
        mostrarNotificacion("¡Ticket copiado al portapapeles!");
        setTimeout(() => {
          btnCopiarTicket.textContent = "Copiar ticket";
        }, 1800);
      } catch (error) {
        console.error("No se pudo copiar el ticket:", error);
        mostrarNotificacion("No se pudo copiar automáticamente el ticket.");
      }
    });
  }
}

