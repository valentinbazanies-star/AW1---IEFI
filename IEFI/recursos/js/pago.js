import { formatearPrecio } from "./funciones.js";
import {
  obtenerCarrito,
  guardarCarrito,
  calcularTotalCarrito,
} from "./carrito.js";
import {
  calcularCostoEnvio,
  validarTextoMinimo,
  validarEmail,
  validarTelefono,
  validarCodigoPostal,
  formatearNumeroTarjeta,
  validarNumeroTarjeta,
  formatearVencimiento,
  validarVencimiento,
  validarCVV,
} from "./checkoutFunciones.js";

const mensajeVacio = document.getElementById("mensaje-carrito-vacio");
const contenedorCheckout = document.getElementById("contenedor-checkout");
const resumenItems = document.getElementById("resumen-items");
const resumenSubtotal = document.getElementById("resumen-subtotal");
const resumenEnvio = document.getElementById("resumen-envio");
const resumenTotal = document.getElementById("resumen-total");

const formPago = document.getElementById("form-pago");
const radiosEntrega = document.querySelectorAll('input[name="metodoEntrega"]');
const camposEnvio = document.getElementById("campos-envio");

const inputDireccion = document.getElementById("direccion");
const inputLocalidad = document.getElementById("localidad");
const inputCodigoPostal = document.getElementById("codigo-postal");
const inputNombre = document.getElementById("nombre");
const inputEmail = document.getElementById("email");
const inputTelefono = document.getElementById("telefono");
const inputTarjeta = document.getElementById("numero-tarjeta");
const inputTitular = document.getElementById("titular-tarjeta");
const inputVencimiento = document.getElementById("vencimiento-tarjeta");
const inputCvv = document.getElementById("cvv-tarjeta");

const modalPasarela = document.getElementById("modal-pasarela");
const pasarelaTitulo = document.getElementById("pasarela-titulo");
const pasarelaMensaje = document.getElementById("pasarela-mensaje");
const pasarelaAcciones = document.getElementById("pasarela-acciones");

let carrito = obtenerCarrito();

function obtenerMetodoEntrega() {
  const seleccionado = document.querySelector(
    'input[name="metodoEntrega"]:checked'
  );
  return seleccionado ? seleccionado.value : "retiro";
}

function mostrarResumenPedido() {
  if (!resumenItems) return;

  let itemsHTML = "";
  carrito.forEach((item) => {
    const subtotalItem = item.precio * item.cantidad;
    itemsHTML += `
      <div class="resumen-item">
        <div>
          <strong>${item.nombre}</strong>
          <span> × ${item.cantidad}</span>
        </div>
        <strong>${formatearPrecio(subtotalItem)}</strong>
      </div>`;
  });

  resumenItems.innerHTML = itemsHTML;

  const subtotal = calcularTotalCarrito(carrito);
  const costoEnvio = calcularCostoEnvio(subtotal, obtenerMetodoEntrega());
  const total = subtotal + costoEnvio;

  resumenSubtotal.textContent = formatearPrecio(subtotal);
  resumenEnvio.textContent =
    costoEnvio === 0 ? "Gratis" : formatearPrecio(costoEnvio);
  resumenTotal.textContent = formatearPrecio(total);
}

function actualizarCamposEntrega() {
  const esEnvio = obtenerMetodoEntrega() === "envio";
  camposEnvio.hidden = !esEnvio;

  inputDireccion.required = esEnvio;
  inputLocalidad.required = esEnvio;
  inputCodigoPostal.required = esEnvio;

  if (!esEnvio) {
    limpiarEstadoCampo(inputDireccion, "error-direccion");
    limpiarEstadoCampo(inputLocalidad, "error-localidad");
    limpiarEstadoCampo(inputCodigoPostal, "error-codigo-postal");
  }

  mostrarResumenPedido();
}

function limpiarEstadoCampo(input, idError) {
  input.classList.remove("campo-invalido", "campo-valido");
  const errorElemento = document.getElementById(idError);
  if (errorElemento) errorElemento.textContent = "";
}

function validarCampo(input, idError, condicion, mensajeError) {
  const errorElemento = document.getElementById(idError);

  if (condicion) {
    input.classList.remove("campo-invalido");
    input.classList.add("campo-valido");
    if (errorElemento) errorElemento.textContent = "";
    return true;
  }

  input.classList.remove("campo-valido");
  input.classList.add("campo-invalido");
  if (errorElemento) errorElemento.textContent = mensajeError;
  return false;
}

function validarTodoElFormulario() {
  let esValido = true;

  if (obtenerMetodoEntrega() === "envio") {
    if (
      !validarCampo(
        inputDireccion,
        "error-direccion",
        validarTextoMinimo(inputDireccion.value, 5),
        "Ingresá una dirección válida (mínimo 5 caracteres)."
      )
    ) {
      esValido = false;
    }

    if (
      !validarCampo(
        inputLocalidad,
        "error-localidad",
        validarTextoMinimo(inputLocalidad.value, 3),
        "Ingresá tu localidad."
      )
    ) {
      esValido = false;
    }

    if (
      !validarCampo(
        inputCodigoPostal,
        "error-codigo-postal",
        validarCodigoPostal(inputCodigoPostal.value),
        "Ingresá un código postal de 4 dígitos."
      )
    ) {
      esValido = false;
    }
  }

  if (
    !validarCampo(
      inputNombre,
      "error-nombre",
      validarTextoMinimo(inputNombre.value, 3),
      "Ingresá tu nombre completo."
    )
  ) {
    esValido = false;
  }

  if (
    !validarCampo(
      inputEmail,
      "error-email",
      validarEmail(inputEmail.value),
      "Ingresá un correo electrónico válido."
    )
  ) {
    esValido = false;
  }

  if (
    !validarCampo(
      inputTelefono,
      "error-telefono",
      validarTelefono(inputTelefono.value),
      "Ingresá un teléfono válido (entre 8 y 15 dígitos)."
    )
  ) {
    esValido = false;
  }

  if (
    !validarCampo(
      inputTarjeta,
      "error-numero-tarjeta",
      validarNumeroTarjeta(inputTarjeta.value),
      "El número de tarjeta debe tener 16 dígitos."
    )
  ) {
    esValido = false;
  }

  if (
    !validarCampo(
      inputTitular,
      "error-titular-tarjeta",
      validarTextoMinimo(inputTitular.value, 3),
      "Ingresá el nombre del titular."
    )
  ) {
    esValido = false;
  }

  if (
    !validarCampo(
      inputVencimiento,
      "error-vencimiento-tarjeta",
      validarVencimiento(inputVencimiento.value),
      "Ingresá una fecha válida (MM/AA) no vencida."
    )
  ) {
    esValido = false;
  }

  if (
    !validarCampo(
      inputCvv,
      "error-cvv-tarjeta",
      validarCVV(inputCvv.value),
      "El CVV debe tener 3 o 4 dígitos."
    )
  ) {
    esValido = false;
  }

  return esValido;
}

if (carrito.length === 0) {
  mensajeVacio.hidden = false;
  contenedorCheckout.hidden = true;
} else {
  mensajeVacio.hidden = true;
  contenedorCheckout.hidden = false;
  actualizarCamposEntrega();

  radiosEntrega.forEach((radio) => {
    radio.addEventListener("change", actualizarCamposEntrega);
  });

  inputDireccion.addEventListener("input", () =>
    validarCampo(
      inputDireccion,
      "error-direccion",
      validarTextoMinimo(inputDireccion.value, 5),
      "Ingresá una dirección válida (mínimo 5 caracteres)."
    )
  );

  inputLocalidad.addEventListener("input", () =>
    validarCampo(
      inputLocalidad,
      "error-localidad",
      validarTextoMinimo(inputLocalidad.value, 3),
      "Ingresá tu localidad."
    )
  );

  inputCodigoPostal.addEventListener("input", () => {
    inputCodigoPostal.value = inputCodigoPostal.value.replace(/\D/g, "").slice(0, 4);
    validarCampo(
      inputCodigoPostal,
      "error-codigo-postal",
      validarCodigoPostal(inputCodigoPostal.value),
      "Ingresá un código postal de 4 dígitos."
    );
  });

  inputNombre.addEventListener("input", () =>
    validarCampo(
      inputNombre,
      "error-nombre",
      validarTextoMinimo(inputNombre.value, 3),
      "Ingresá tu nombre completo."
    )
  );

  inputEmail.addEventListener("input", () =>
    validarCampo(
      inputEmail,
      "error-email",
      validarEmail(inputEmail.value),
      "Ingresá un correo electrónico válido."
    )
  );

  inputTelefono.addEventListener("input", () =>
    validarCampo(
      inputTelefono,
      "error-telefono",
      validarTelefono(inputTelefono.value),
      "Ingresá un teléfono válido (entre 8 y 15 dígitos)."
    )
  );

  inputTarjeta.addEventListener("input", () => {
    inputTarjeta.value = formatearNumeroTarjeta(inputTarjeta.value);
    validarCampo(
      inputTarjeta,
      "error-numero-tarjeta",
      validarNumeroTarjeta(inputTarjeta.value),
      "El número de tarjeta debe tener 16 dígitos."
    );
  });

  inputTitular.addEventListener("input", () =>
    validarCampo(
      inputTitular,
      "error-titular-tarjeta",
      validarTextoMinimo(inputTitular.value, 3),
      "Ingresá el nombre del titular."
    )
  );

  inputVencimiento.addEventListener("input", () => {
    inputVencimiento.value = formatearVencimiento(inputVencimiento.value);
    validarCampo(
      inputVencimiento,
      "error-vencimiento-tarjeta",
      validarVencimiento(inputVencimiento.value),
      "Ingresá una fecha válida (MM/AA) no vencida."
    );
  });

  inputCvv.addEventListener("input", () => {
    inputCvv.value = inputCvv.value.replace(/\D/g, "").slice(0, 4);
    validarCampo(
      inputCvv,
      "error-cvv-tarjeta",
      validarCVV(inputCvv.value),
      "El CVV debe tener 3 o 4 dígitos."
    );
  });

  formPago.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!validarTodoElFormulario()) {
      return;
    }

    const subtotal = calcularTotalCarrito(carrito);
    const metodoEntrega = obtenerMetodoEntrega();
    const costoEnvio = calcularCostoEnvio(subtotal, metodoEntrega);
    const digitosTarjeta = inputTarjeta.value.replace(/\D/g, "");

    const pedido = {
      numeroOrden: `CSD-${Date.now().toString().slice(-6)}`,
      fecha: new Date().toLocaleString("es-AR"),
      cliente: {
        nombre: inputNombre.value.trim(),
        email: inputEmail.value.trim(),
        telefono: inputTelefono.value.trim(),
      },
      entrega: {
        metodo: metodoEntrega,
        direccion: metodoEntrega === "envio" ? inputDireccion.value.trim() : "Quilmes 3180, Córdoba",
        localidad: metodoEntrega === "envio" ? inputLocalidad.value.trim() : "Córdoba",
        codigoPostal: metodoEntrega === "envio" ? inputCodigoPostal.value.trim() : "5000",
        costoEnvio,
      },
      pago: {
        ultimosDigitos: digitosTarjeta.slice(-4),
        titular: inputTitular.value.trim(),
      },
      items: carrito,
      subtotal,
      total: subtotal + costoEnvio,
    };

    localStorage.setItem("ultimoPedido", JSON.stringify(pedido));
    guardarCarrito([]);

    pasarelaTitulo.textContent = "Conectando con Pasarela de Pago...";
    pasarelaMensaje.textContent =
      "Estamos procesando tu pago simulado de forma segura.";
    pasarelaAcciones.hidden = true;
    modalPasarela.showModal();

    setTimeout(() => {
      pasarelaTitulo.textContent = "¡Pago simulado aprobado!";
      pasarelaMensaje.textContent = `Orden ${pedido.numeroOrden} aprobada. Redirigiendo a tu ticket digital...`;
      pasarelaAcciones.hidden = false;

      setTimeout(() => {
        window.location.href = "./confirmacion.html";
      }, 1200);
    }, 1500);
  });
}

