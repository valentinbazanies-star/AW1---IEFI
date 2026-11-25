import { test } from "node:test";
import assert from "node:assert/strict";
import {
  agregarAlCarrito,
  cambiarCantidadCarrito,
  eliminarDelCarrito,
  contarItemsCarrito,
  calcularTotalCarrito,
} from "../recursos/js/carrito.js";

const cherry = { id: 1, nombre: "Cherry Detailer", precio: 8500, imagen: "cherry.jpg" };
const iron   = { id: 2, nombre: "Iron Toxic",      precio: 12000, imagen: "iron.jpg" };

test("agregarAlCarrito agrega un producto nuevo al carrito", () => {
  const carrito = [];
  const resultado = agregarAlCarrito(carrito, cherry);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, 1);
  assert.equal(resultado[0].cantidad, 1);
});

test("agregarAlCarrito incrementa la cantidad si el producto ya existe", () => {
  let carrito = agregarAlCarrito([], cherry);
  carrito = agregarAlCarrito(carrito, cherry);
  assert.equal(carrito.length, 1);
  assert.equal(carrito[0].cantidad, 2);
});

test("agregarAlCarrito no modifica el carrito original (inmutabilidad)", () => {
  const carritoOriginal = [];
  agregarAlCarrito(carritoOriginal, cherry);
  assert.equal(carritoOriginal.length, 0);
});

test("cambiarCantidadCarrito suma 1 a la cantidad", () => {
  const carrito = agregarAlCarrito([], cherry);
  const resultado = cambiarCantidadCarrito(carrito, 1, 1);
  assert.equal(resultado[0].cantidad, 2);
});

test("cambiarCantidadCarrito resta 1 a la cantidad", () => {
  let carrito = agregarAlCarrito([], cherry);
  carrito = agregarAlCarrito(carrito, cherry); 
  const resultado = cambiarCantidadCarrito(carrito, 1, -1);
  assert.equal(resultado[0].cantidad, 1);
});

test("cambiarCantidadCarrito elimina el producto si la cantidad llega a 0", () => {
  const carrito = agregarAlCarrito([], cherry); 
  const resultado = cambiarCantidadCarrito(carrito, 1, -1);
  assert.equal(resultado.length, 0);
});

test("eliminarDelCarrito quita el producto del carrito", () => {
  let carrito = agregarAlCarrito([], cherry);
  carrito = agregarAlCarrito(carrito, iron);
  const resultado = eliminarDelCarrito(carrito, 1);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].id, 2);
});

test("contarItemsCarrito suma las cantidades de todos los productos", () => {
  let carrito = agregarAlCarrito([], cherry);
  carrito = agregarAlCarrito(carrito, cherry); 
  carrito = agregarAlCarrito(carrito, iron);   
  assert.equal(contarItemsCarrito(carrito), 3);
});

test("contarItemsCarrito devuelve 0 para carrito vacío", () => {
  assert.equal(contarItemsCarrito([]), 0);
});


test("calcularTotalCarrito calcula el total correcto", () => {
  let carrito = agregarAlCarrito([], cherry); 
  carrito = agregarAlCarrito(carrito, iron);  
  assert.equal(calcularTotalCarrito(carrito), 20500);
});

test("calcularTotalCarrito con múltiples cantidades", () => {
  let carrito = agregarAlCarrito([], cherry);
  carrito = agregarAlCarrito(carrito, cherry); 
  assert.equal(calcularTotalCarrito(carrito), 17000);
});

test("calcularTotalCarrito devuelve 0 para carrito vacío", () => {
  assert.equal(calcularTotalCarrito([]), 0);
});

