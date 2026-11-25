import { test } from "node:test";
import assert from "node:assert/strict";
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
} from "../recursos/js/checkoutFunciones.js";

// --- calcularCostoEnvio ---

test("calcularCostoEnvio con retiro en local es gratis", () => {
  assert.equal(calcularCostoEnvio(5000, "retiro"), 0);
});

test("calcularCostoEnvio con envío bajo el mínimo cobra $3500", () => {
  assert.equal(calcularCostoEnvio(5000, "envio"), 3500);
});

test("calcularCostoEnvio con envío superando $20000 es gratis", () => {
  assert.equal(calcularCostoEnvio(20000, "envio"), 0);
});

test("calcularCostoEnvio con envío justo en el límite ($19999) cobra", () => {
  assert.equal(calcularCostoEnvio(19999, "envio"), 3500);
});

// --- validarTextoMinimo ---

test("validarTextoMinimo acepta texto de exactamente 3 caracteres", () => {
  assert.equal(validarTextoMinimo("abc"), true);
});

test("validarTextoMinimo rechaza texto de 2 caracteres", () => {
  assert.equal(validarTextoMinimo("ab"), false);
});

test("validarTextoMinimo ignora espacios al inicio y al final", () => {
  assert.equal(validarTextoMinimo("  ab  "), false);
});

test("validarTextoMinimo con mínimo personalizado", () => {
  assert.equal(validarTextoMinimo("hola", 5), false);
  assert.equal(validarTextoMinimo("hello", 5), true);
});

// --- validarEmail ---

test("validarEmail acepta email con formato correcto", () => {
  assert.equal(validarEmail("test@gmail.com"), true);
});

test("validarEmail rechaza email sin arroba", () => {
  assert.equal(validarEmail("testgmail.com"), false);
});

test("validarEmail rechaza email sin dominio", () => {
  assert.equal(validarEmail("test@"), false);
});

test("validarEmail rechaza string vacío", () => {
  assert.equal(validarEmail(""), false);
});

// --- validarTelefono ---

test("validarTelefono acepta número de 10 dígitos", () => {
  assert.equal(validarTelefono("3511234567"), true);
});

test("validarTelefono rechaza número de 3 dígitos", () => {
  assert.equal(validarTelefono("123"), false);
});

test("validarTelefono ignora guiones y espacios", () => {
  assert.equal(validarTelefono("351-123-4567"), true);
});

// --- validarCodigoPostal ---

test("validarCodigoPostal acepta 4 dígitos", () => {
  assert.equal(validarCodigoPostal("5000"), true);
});

test("validarCodigoPostal rechaza 3 dígitos", () => {
  assert.equal(validarCodigoPostal("500"), false);
});

test("validarCodigoPostal rechaza letras", () => {
  assert.equal(validarCodigoPostal("ABCD"), false);
});

// --- formatearNumeroTarjeta ---

test("formatearNumeroTarjeta agrupa los dígitos de a 4", () => {
  assert.equal(formatearNumeroTarjeta("4509123456789010"), "4509 1234 5678 9010");
});

test("formatearNumeroTarjeta ignora caracteres no numéricos", () => {
  assert.equal(formatearNumeroTarjeta("4509-1234-5678-9010"), "4509 1234 5678 9010");
});

// --- validarNumeroTarjeta ---

test("validarNumeroTarjeta acepta exactamente 16 dígitos", () => {
  assert.equal(validarNumeroTarjeta("4509 1234 5678 9010"), true);
});

test("validarNumeroTarjeta rechaza menos de 16 dígitos", () => {
  assert.equal(validarNumeroTarjeta("1234 5678"), false);
});

// --- formatearVencimiento ---

test("formatearVencimiento inserta la barra después de 2 dígitos", () => {
  assert.equal(formatearVencimiento("1228"), "12/28");
});

test("formatearVencimiento sin barra si tiene menos de 3 dígitos", () => {
  assert.equal(formatearVencimiento("12"), "12");
});

// --- validarVencimiento ---

test("validarVencimiento acepta fecha futura", () => {
  const fechaFija = new Date(2026, 0, 1); // enero 2026
  assert.equal(validarVencimiento("12/28", fechaFija), true);
});

test("validarVencimiento rechaza fecha pasada", () => {
  const fechaFija = new Date(2026, 0, 1); // enero 2026
  assert.equal(validarVencimiento("12/24", fechaFija), false);
});

test("validarVencimiento rechaza mes inválido", () => {
  const fechaFija = new Date(2026, 0, 1);
  assert.equal(validarVencimiento("13/28", fechaFija), false);
});

test("validarVencimiento rechaza formato incorrecto", () => {
  const fechaFija = new Date(2026, 0, 1);
  assert.equal(validarVencimiento("1228", fechaFija), false);
});

// --- validarCVV ---

test("validarCVV acepta 3 dígitos", () => {
  assert.equal(validarCVV("123"), true);
});

test("validarCVV acepta 4 dígitos (Amex)", () => {
  assert.equal(validarCVV("1234"), true);
});

test("validarCVV rechaza 2 dígitos", () => {
  assert.equal(validarCVV("12"), false);
});

test("validarCVV rechaza letras", () => {
  assert.equal(validarCVV("abc"), false);
});

