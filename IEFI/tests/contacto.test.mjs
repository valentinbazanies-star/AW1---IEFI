function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validarTelefono(telefono) {
  if (telefono.trim() === "") return true;
  const soloDigitos = telefono.replace(/\D/g, "");
  return soloDigitos.length >= 8 && soloDigitos.length <= 15;
}

const casos = [
  [validarEmail("test@gmail.com"), true, "email valido"],
  [validarEmail("no-arroba"), false, "email sin @"],
  [validarEmail(""), false, "email vacio"],
  [validarTelefono(""), true, "telefono vacio (opcional)"],
  [validarTelefono("3511234567"), true, "telefono 10 digitos"],
  [validarTelefono("123"), false, "telefono muy corto"],
  ["hola".trim().length >= 3, true, "nombre valido"],
  ["ab".trim().length >= 3, false, "nombre muy corto"],
];

let ok = true;
for (const [resultado, esperado, label] of casos) {
  const paso = resultado === esperado;
  console.log((paso ? "OK" : "FAIL") + " " + label);
  if (!paso) ok = false;
}
console.log(ok ? "ALL_CONTACTO_CHECKS_PASSED" : "ALGUN_CHECK_FALLO");

