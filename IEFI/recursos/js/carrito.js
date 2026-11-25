import { formatearPrecio } from "./funciones.js";

const CLAVE_CARRITO = "carrito";

function obtenerCarrito() {
  try {
    const datosGuardados = localStorage.getItem(CLAVE_CARRITO);
    if (!datosGuardados) {
      return [];
    }
    const carrito = JSON.parse(datosGuardados);
    return Array.isArray(carrito) ? carrito : [];
  } catch (error) {
    console.error("Error al leer el carrito de localStorage:", error);
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(carrito, producto) {
  const existe = carrito.find((item) => item.id === producto.id);

  if (existe) {
    return carrito.map((item) => {
      if (item.id === producto.id) {
        return { ...item, cantidad: item.cantidad + 1 };
      }
      return item;
    });
  }

  return [
    ...carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: 1,
    },
  ];
}

function cambiarCantidadCarrito(carrito, idProducto, cambio) {
  return carrito
    .map((item) => {
      if (item.id === idProducto) {
        return { ...item, cantidad: item.cantidad + cambio };
      }
      return item;
    })
    .filter((item) => item.cantidad > 0);
}

function eliminarDelCarrito(carrito, idProducto) {
  return carrito.filter((item) => item.id !== idProducto);
}

function contarItemsCarrito(carrito) {
  let total = 0;
  carrito.forEach((item) => {
    total += item.cantidad;
  });
  return total;
}

function calcularTotalCarrito(carrito) {
  let total = 0;
  carrito.forEach((item) => {
    total += item.precio * item.cantidad;
  });
  return total;
}

function renderizarCarrito(
  carrito,
  contenedorLista,
  elementoTotal,
  elementoContador
) {
  if (elementoContador) {
    elementoContador.textContent = contarItemsCarrito(carrito);
  }

  if (elementoTotal) {
    elementoTotal.textContent = formatearPrecio(calcularTotalCarrito(carrito));
  }

  if (!contenedorLista) return;

  if (!carrito || carrito.length === 0) {
    contenedorLista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
    return;
  }

  let carritoHTML = "";

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    carritoHTML += `
      <div class="carrito-item">
        <div class="carrito-item__info">
          <h3>${item.nombre}</h3>
          <p>${formatearPrecio(item.precio)} c/u · Subtotal: ${formatearPrecio(subtotal)}</p>
        </div>
        <div class="carrito-item__controles">
          <button type="button" class="btn-cantidad btn-restar" data-id="${item.id}" aria-label="Restar unidad">-</button>
          <span class="carrito-item__cantidad">${item.cantidad}</span>
          <button type="button" class="btn-cantidad btn-sumar" data-id="${item.id}" aria-label="Sumar unidad">+</button>
          <button type="button" class="btn-eliminar" data-id="${item.id}">Eliminar</button>
        </div>
      </div>`;
  });

  contenedorLista.innerHTML = carritoHTML;
}

export {
  obtenerCarrito,
  guardarCarrito,
  agregarAlCarrito,
  cambiarCantidadCarrito,
  eliminarDelCarrito,
  contarItemsCarrito,
  calcularTotalCarrito,
  renderizarCarrito,
};

