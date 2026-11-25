import { formatearPrecio } from "./funciones.js";

function generarTextoTicket(pedido) {
  const metodoTexto =
    pedido.entrega.metodo === "envio"
      ? `Envío a domicilio (${pedido.entrega.direccion}, ${pedido.entrega.localidad} - CP ${pedido.entrega.codigoPostal})`
      : "Retiro en el local (Quilmes 3180, Córdoba)";

  const envioTexto =
    pedido.entrega.costoEnvio === 0
      ? "Gratis"
      : formatearPrecio(pedido.entrega.costoEnvio);

  const lineasProductos = pedido.items
    .map(
      (item) =>
        `- ${item.nombre} x${item.cantidad}: ${formatearPrecio(item.precio * item.cantidad)}`
    )
    .join("\n");

  return [
    "CUPPER SHOP DETAIL - TICKET DIGITAL",
    `Orden: ${pedido.numeroOrden}`,
    `Fecha: ${pedido.fecha}`,
    `Cliente: ${pedido.cliente.nombre} (${pedido.cliente.email} | Tel: ${pedido.cliente.telefono})`,
    `Entrega: ${metodoTexto}`,
    `Pago: Tarjeta terminada en **** ${pedido.pago.ultimosDigitos}`,
    "",
    "Productos:",
    lineasProductos,
    "",
    `Subtotal: ${formatearPrecio(pedido.subtotal)}`,
    `Envío: ${envioTexto}`,
    `Total: ${formatearPrecio(pedido.total)}`,
  ].join("\n");
}

function generarUrlWhatsApp(pedido, numeroWhatsapp) {
  const mensaje = generarTextoTicket(pedido);
  return `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
}

export { generarTextoTicket, generarUrlWhatsApp };

