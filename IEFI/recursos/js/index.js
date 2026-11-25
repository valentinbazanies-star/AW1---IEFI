import { URL_PRODUCTOS } from "./config.js";
import {
  renderizarProductos,
  filtrarProductos,
  cargarCategorias,
  mostrarMensaje,
  obtenerDatos,
} from "./funciones.js";
import {
  obtenerCarrito,
  guardarCarrito,
  agregarAlCarrito,
  cambiarCantidadCarrito,
  eliminarDelCarrito,
  renderizarCarrito,
} from "./carrito.js";

const contenedorProductos = document.getElementById("contenedor-productos");
const filtroTexto = document.getElementById("filtro-texto");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroPrecio = document.getElementById("filtro-precio");
const btnLimpiarFiltros = document.getElementById("btn-limpiar-filtros");

const btnAbrirCarrito = document.getElementById("btn-abrir-carrito");
const modalCarrito = document.getElementById("modal-carrito");
const btnCerrarCarrito = document.getElementById("btn-cerrar-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const btnVaciarCarrito = document.getElementById("btn-vaciar-carrito");
const btnIrPago = document.getElementById("btn-ir-pago");

let productosDetailing = [];
let carrito = obtenerCarrito();

function actualizarVistaCarrito() {
  renderizarCarrito(carrito, listaCarrito, totalCarrito, contadorCarrito);

  if (btnIrPago) {
    if (carrito.length === 0) {
      btnIrPago.classList.add("btn-pagar--deshabilitado");
      btnIrPago.setAttribute("aria-disabled", "true");
    } else {
      btnIrPago.classList.remove("btn-pagar--deshabilitado");
      btnIrPago.removeAttribute("aria-disabled");
    }
  }
}

function aplicarFiltros() {
  const texto = filtroTexto ? filtroTexto.value : "";
  const categoria = filtroCategoria ? filtroCategoria.value : "todas";
  const precioMax =
    filtroPrecio && filtroPrecio.value ? Number(filtroPrecio.value) : null;

  const productosFiltrados = filtrarProductos(
    productosDetailing,
    texto,
    categoria,
    precioMax
  );

  renderizarProductos(productosFiltrados, contenedorProductos);
}

actualizarVistaCarrito();

if (btnAbrirCarrito && modalCarrito) {
  btnAbrirCarrito.addEventListener("click", () => {
    actualizarVistaCarrito();
    modalCarrito.showModal();
  });
}

if (btnCerrarCarrito && modalCarrito) {
  btnCerrarCarrito.addEventListener("click", () => {
    modalCarrito.close();
  });
}

if (modalCarrito) {
  modalCarrito.addEventListener("click", (evento) => {
    if (evento.target === modalCarrito) {
      modalCarrito.close();
    }
  });
}

if (btnVaciarCarrito) {
  btnVaciarCarrito.addEventListener("click", () => {
    carrito = [];
    guardarCarrito(carrito);
    actualizarVistaCarrito();
  });
}

if (listaCarrito) {
  listaCarrito.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (!boton) return;

    const idProducto = Number(boton.dataset.id);

    if (boton.classList.contains("btn-sumar")) {
      carrito = cambiarCantidadCarrito(carrito, idProducto, 1);
    } else if (boton.classList.contains("btn-restar")) {
      carrito = cambiarCantidadCarrito(carrito, idProducto, -1);
    } else if (boton.classList.contains("btn-eliminar")) {
      carrito = eliminarDelCarrito(carrito, idProducto);
    }

    guardarCarrito(carrito);
    actualizarVistaCarrito();
  });
}

if (contenedorProductos) {
  mostrarMensaje(contenedorProductos, "Cargando productos...");

  const datos = await obtenerDatos(URL_PRODUCTOS);

  if (!datos) {
    mostrarMensaje(
      contenedorProductos,
      "No se pudieron cargar los productos. Intentá nuevamente más tarde.",
      true
    );
  } else {
    productosDetailing = datos;
    cargarCategorias(productosDetailing, filtroCategoria);

    const params = new URLSearchParams(window.location.search);
    const categoriaURL = params.get("categoria");
    if (categoriaURL && filtroCategoria) {
      filtroCategoria.value = categoriaURL;
    }

    aplicarFiltros();

    contenedorProductos.addEventListener("click", (evento) => {
      const boton = evento.target.closest(".boton-agregar");
      if (!boton) return;

      const idProducto = Number(boton.dataset.id);
      const producto = productosDetailing.find((item) => item.id === idProducto);
      if (!producto) return;

      carrito = agregarAlCarrito(carrito, producto);
      guardarCarrito(carrito);
      actualizarVistaCarrito();

      const textoOriginal = boton.textContent;
      boton.textContent = "¡Agregado!";
      setTimeout(() => {
        boton.textContent = textoOriginal;
      }, 800);
    });

    if (filtroTexto) {
      filtroTexto.addEventListener("input", aplicarFiltros);
    }

    if (filtroCategoria) {
      filtroCategoria.addEventListener("change", aplicarFiltros);
    }

    if (filtroPrecio) {
      filtroPrecio.addEventListener("input", aplicarFiltros);
    }

    if (btnLimpiarFiltros) {
      btnLimpiarFiltros.addEventListener("click", () => {
        if (filtroTexto) filtroTexto.value = "";
        if (filtroCategoria) filtroCategoria.value = "todas";
        if (filtroPrecio) filtroPrecio.value = "";
        aplicarFiltros();
      });
    }
  }
}
