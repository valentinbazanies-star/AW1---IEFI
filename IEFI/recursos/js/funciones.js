function formatearPrecio(precio) {
  if (typeof precio === "number") {
    return `$${precio.toLocaleString("es-AR")}`;
  }
  return precio;
}

function mostrarMensaje(contenedor, mensaje, esError = false) {
  const clase = esError
    ? "estado-catalogo estado-catalogo--error"
    : "estado-catalogo";

  contenedor.innerHTML = `<p class="${clase}">${mensaje}</p>`;
}

function renderizarProductos(productos, contenedor) {
  if (!productos || productos.length === 0) {
    mostrarMensaje(contenedor, "No se encontraron productos.");
    return;
  }

  let productosHTML = "";

  productos.forEach((producto) => {
    let titulo = producto.nombre;
    let imagen = `<img src="${producto.imagen}" alt="${producto.nombre}">`;

    if (producto.link) {
      titulo = `<a href="${producto.link}">${producto.nombre}</a>`;
      imagen = `<a href="${producto.link}">${imagen}</a>`;
    }

    productosHTML += `
      <article>
        <span class="categoria-producto">${producto.categoria}</span>
        <h3>${titulo}</h3>
        <picture>
          ${imagen}
        </picture>
        <p>${producto.descripcion}</p>
        <ul>
          <li>Presentación: ${producto.presentacion}</li>
          <li>Precio: ${formatearPrecio(producto.precio)}</li>
        </ul>
        <button type="button" class="boton-agregar" data-id="${producto.id}">Agregar al carrito</button>
      </article>`;
  });

  contenedor.innerHTML = productosHTML;
}

function filtrarProductos(
  productos,
  texto = "",
  categoria = "todas",
  precioMax = null
) {
  const textoBuscado = texto.trim().toLowerCase();

  return productos.filter((producto) => {
    const coincideTexto =
      textoBuscado === "" ||
      producto.nombre.toLowerCase().includes(textoBuscado) ||
      producto.descripcion.toLowerCase().includes(textoBuscado);

    const coincideCategoria =
      categoria === "todas" || producto.categoria === categoria;

    const coincidePrecio =
      !precioMax || precioMax <= 0 || producto.precio <= precioMax;

    return coincideTexto && coincideCategoria && coincidePrecio;
  });
}

function cargarCategorias(productos, selectCategoria) {
  if (!selectCategoria) return;

  const categorias = [];

  productos.forEach((producto) => {
    if (producto.categoria && !categorias.includes(producto.categoria)) {
      categorias.push(producto.categoria);
    }
  });

  let opcionesHTML = `<option value="todas">Todas las categorías</option>`;
  categorias.forEach((categoria) => {
    opcionesHTML += `<option value="${categoria}">${categoria}</option>`;
  });

  selectCategoria.innerHTML = opcionesHTML;
}

async function obtenerDatos(url) {
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return null;
  }
}

export {
  formatearPrecio,
  mostrarMensaje,
  renderizarProductos,
  filtrarProductos,
  cargarCategorias,
  obtenerDatos,
};
