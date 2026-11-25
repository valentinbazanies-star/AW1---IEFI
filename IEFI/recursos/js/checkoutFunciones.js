const COSTO_ENVIO = 3500;
const MONTO_ENVIO_GRATIS = 20000;

function calcularCostoEnvio(subtotal, metodoEntrega) {
  if (metodoEntrega !== "envio") {
    return 0;
  }
  if (subtotal >= MONTO_ENVIO_GRATIS) {
    return 0;
  }
  return COSTO_ENVIO;
}

function validarTextoMinimo(valor, minimo = 3) {
  return valor.trim().length >= minimo;
}

function validarEmail(email) {
  const texto = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
}

function validarTelefono(telefono) {
  const soloDigitos = telefono.replace(/\D/g, "");
  return soloDigitos.length >= 8 && soloDigitos.length <= 15;
}

function validarCodigoPostal(cp) {
  return /^\d{4}$/.test(cp.trim());
}

function formatearNumeroTarjeta(valor) {
  const soloDigitos = valor.replace(/\D/g, "").slice(0, 16);
  const grupos = soloDigitos.match(/.{1,4}/g);
  return grupos ? grupos.join(" ") : "";
}

function validarNumeroTarjeta(numero) {
  const soloDigitos = numero.replace(/\D/g, "");
  return soloDigitos.length === 16;
}

function formatearVencimiento(valor) {
  const soloDigitos = valor.replace(/\D/g, "").slice(0, 4);
  if (soloDigitos.length >= 3) {
    return `${soloDigitos.slice(0, 2)}/${soloDigitos.slice(2)}`;
  }
  return soloDigitos;
}

function validarVencimiento(valor, fechaActual = new Date()) {
  if (!/^\d{2}\/\d{2}$/.test(valor.trim())) {
    return false;
  }

  const [mesTexto, anioTexto] = valor.split("/");
  const mes = Number(mesTexto);
  const anio = 2000 + Number(anioTexto);

  if (mes < 1 || mes > 12) {
    return false;
  }

  const anioActual = fechaActual.getFullYear();
  const mesActual = fechaActual.getMonth() + 1;

  if (anio < anioActual) {
    return false;
  }
  if (anio === anioActual && mes < mesActual) {
    return false;
  }

  return true;
}

function validarCVV(cvv) {
  return /^\d{3,4}$/.test(cvv.trim());
}

export {
  COSTO_ENVIO,
  MONTO_ENVIO_GRATIS,
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
};

