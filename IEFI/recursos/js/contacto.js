const formContacto = document.getElementById("form-contacto");
const avisoEnviado = document.getElementById("aviso-enviado");

const inputNombre = document.getElementById("id-nombre");
const inputEmail = document.getElementById("id-email");
const inputTelefono = document.getElementById("id-telefono");
const inputMensaje = document.getElementById("id-mensaje");

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

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validarTelefono(telefono) {
  if (telefono.trim() === "") return true;
  const soloDigitos = telefono.replace(/\D/g, "");
  return soloDigitos.length >= 8 && soloDigitos.length <= 15;
}

inputNombre.addEventListener("input", () => {
  validarCampo(
    inputNombre,
    "error-nombre",
    inputNombre.value.trim().length >= 3,
    "El nombre debe tener al menos 3 caracteres."
  );
});

inputEmail.addEventListener("input", () => {
  validarCampo(
    inputEmail,
    "error-email",
    validarEmail(inputEmail.value),
    "Ingresá un correo electrónico válido."
  );
});

inputTelefono.addEventListener("input", () => {
  validarCampo(
    inputTelefono,
    "error-telefono",
    validarTelefono(inputTelefono.value),
    "Ingresá un teléfono válido (entre 8 y 15 dígitos)."
  );
});

inputMensaje.addEventListener("input", () => {
  validarCampo(
    inputMensaje,
    "error-mensaje",
    inputMensaje.value.trim().length >= 10,
    "El mensaje debe tener al menos 10 caracteres."
  );
});

formContacto.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nombreValido = validarCampo(
    inputNombre,
    "error-nombre",
    inputNombre.value.trim().length >= 3,
    "El nombre debe tener al menos 3 caracteres."
  );

  const emailValido = validarCampo(
    inputEmail,
    "error-email",
    validarEmail(inputEmail.value),
    "Ingresá un correo electrónico válido."
  );

  const telefonoValido = validarCampo(
    inputTelefono,
    "error-telefono",
    validarTelefono(inputTelefono.value),
    "Ingresá un teléfono válido (entre 8 y 15 dígitos)."
  );

  const mensajeValido = validarCampo(
    inputMensaje,
    "error-mensaje",
    inputMensaje.value.trim().length >= 10,
    "El mensaje debe tener al menos 10 caracteres."
  );

  if (!nombreValido || !emailValido || !telefonoValido || !mensajeValido) {
    return;
  }

  formContacto.reset();

  inputNombre.classList.remove("campo-valido");
  inputEmail.classList.remove("campo-valido");
  inputTelefono.classList.remove("campo-valido");
  inputMensaje.classList.remove("campo-valido");

  if (avisoEnviado) {
    avisoEnviado.hidden = false;
    setTimeout(() => {
      avisoEnviado.hidden = true;
    }, 5000);
  }
});
