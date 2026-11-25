import { test } from "node:test";
import assert from "node:assert/strict";

function formatearPrecio(precio) {
  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
}

function filtrarProductos(productos, texto, categoria, precioMax) {
  return productos.filter((producto) => {
    const coincideTexto =
      texto.trim() === "" ||
      producto.nombre.toLowerCase().includes(texto.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(texto.toLowerCase());

    const coincideCategoria =
      categoria === "todas" || producto.categoria === categoria;

    const coincidePrecio =
      precioMax === null || producto.precio <= precioMax;

    return coincideTexto && coincideCategoria && coincidePrecio;
  });
}

// Productos de prueba
const productosDePrueba = [
  { id: 1, nombre: "Cherry Detailer", categoria: "Interiores", precio: 8500, descripcion: "Limpieza interior" },
  { id: 2, nombre: "Iron Toxic",      categoria: "Exteriores", precio: 12000, descripcion: "Descontaminante" },
  { id: 3, nombre: "Black Silk Wax",  categoria: "Ceras y selladores", precio: 22000, descripcion: "Cera carnauba" },
];

// --- Tests de formatearPrecio ---

test("formatearPrecio muestra el signo $", () => {
  const resultado = formatearPrecio(8500);
  assert.ok(resultado.includes("$"), "Debe contener signo $");
});

test("formatearPrecio incluye el número formateado", () => {
  const resultado = formatearPrecio(8500);
  assert.ok(resultado.includes("8.500") || resultado.includes("8500"), "Debe contener el número");
});

test("formatearPrecio con precio 0", () => {
  const resultado = formatearPrecio(0);
  assert.ok(resultado.includes("0"), "Debe mostrar 0");
});

// --- Tests de filtrarProductos ---

test("filtrarProductos sin filtros devuelve todos los productos", () => {
  const resultado = filtrarProductos(productosDePrueba, "", "todas", null);
  assert.equal(resultado.length, 3);
});

test("filtrarProductos por texto encuentra coincidencia en nombre", () => {
  const resultado = filtrarProductos(productosDePrueba, "cherry", "todas", null);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nombre, "Cherry Detailer");
});

test("filtrarProductos por texto no sensible a mayúsculas", () => {
  const resultado = filtrarProductos(productosDePrueba, "IRON", "todas", null);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nombre, "Iron Toxic");
});

test("filtrarProductos por categoría devuelve solo los de esa categoría", () => {
  const resultado = filtrarProductos(productosDePrueba, "", "Exteriores", null);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].categoria, "Exteriores");
});

test("filtrarProductos por precio máximo filtra correctamente", () => {
  const resultado = filtrarProductos(productosDePrueba, "", "todas", 10000);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nombre, "Cherry Detailer");
});

test("filtrarProductos combinado: texto + categoría", () => {
  const resultado = filtrarProductos(productosDePrueba, "wax", "Ceras y selladores", null);
  assert.equal(resultado.length, 1);
  assert.equal(resultado[0].nombre, "Black Silk Wax");
});

test("filtrarProductos con texto que no coincide devuelve array vacío", () => {
  const resultado = filtrarProductos(productosDePrueba, "xyz_no_existe", "todas", null);
  assert.equal(resultado.length, 0);
});

