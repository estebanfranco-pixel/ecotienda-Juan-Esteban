/**
 * VoltioVerde Store - Lógica de Catálogo, Filtros y Carrito
 * Autor: Juan Esteban Franco Monsalve
 */

// 1. Arreglo de Objetos Literales (Mínimo 8 productos en 3 categorías)
const productos = [
  { id: 1, nombre: "Nevera Inverter No Frost 400L", categoria: "Refrigeracion", precio: 2450000, potenciaAnterior: 350, potenciaNueva: 160, horasUsoDia: 24, imagen: "https://via.placeholder.com/300x200?text=Nevera+Inverter" },
  { id: 2, nombre: "Congelador Horizontal 200L", categoria: "Refrigeracion", precio: 1350000, potenciaAnterior: 280, potenciaNueva: 110, horasUsoDia: 24, imagen: "https://via.placeholder.com/300x200?text=Congelador" },
  { id: 3, nombre: "Aire Acondicionado Inverter 12000 BTU", categoria: "Climatizacion", precio: 1890000, potenciaAnterior: 1400, potenciaNueva: 650, horasUsoDia: 8, imagen: "https://via.placeholder.com/300x200?text=Aire+12000+BTU" },
  { id: 4, nombre: "Aire Acondicionado Portátil Ecológico", categoria: "Climatizacion", precio: 1290000, potenciaAnterior: 1200, potenciaNueva: 750, horasUsoDia: 6, imagen: "https://via.placeholder.com/300x200?text=Aire+Portatil" },
  { id: 5, nombre: "Panel LED Alta Eficiencia 40W (Pack x4)", categoria: "Iluminacion", precio: 180000, potenciaAnterior: 160, potenciaNueva: 40, horasUsoDia: 10, imagen: "https://via.placeholder.com/300x200?text=Panel+LED" },
  { id: 6, nombre: "Reflector Solar LED 100W Exterior", categoria: "Iluminacion", precio: 220000, potenciaAnterior: 250, potenciaNueva: 0, horasUsoDia: 12, imagen: "https://via.placeholder.com/300x200?text=Reflector+Solar" },
  { id: 7, nombre: "Ventilador de Techo Motor DC Eco", categoria: "Climatizacion", precio: 340000, potenciaAnterior: 90, potenciaNueva: 30, horasUsoDia: 8, imagen: "https://via.placeholder.com/300x200?text=Ventilador+DC" },
  { id: 8, nombre: "Nevecon Side-by-Side Smart Inverter", categoria: "Refrigeracion", precio: 4890000, potenciaAnterior: 500, potenciaNueva: 210, horasUsoDia: 24, imagen: "https://via.placeholder.com/300x200?text=Nevecon+Smart" }
];

// Estado del Carrito
let carrito = [];
const TARIFA_KWH_COLOMBIA = 850; // Tarifa promedio en COP por kWh

// 2. Funciones Propias de Cálculo y Formato
function calcularAhorroKwhMes(potenciaAnterior, potenciaNueva, horasUsoDia) {
  const diferenciaWatts = potenciaAnterior - potenciaNueva;
  const ahorroDiarioKwh = (diferenciaWatts * horasUsoDia) / 1000;
  return ahorroDiarioKwh * 30; // Ahorro mensual en kWh
}

function calcularAhorroPesosMes(ahorroKwhMes) {
  return ahorroKwhMes * TARIFA_KWH_COLOMBIA;
}

function formatearMoneda(valor) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(valor);
}

function obtenerNombreCategoria(catKey) {
  const categorias = {
    Refrigeracion: "Refrigeración",
    Climatizacion: "Climatización",
    Iluminacion: "Iluminación"
  };

  return categorias[catKey] || catKey;

// 3. Renderizado Dinámico del Catálogo en el DOM
function renderizarProductos(lista) {
  const contenedorGrid = document.querySelector("#grid-productos");
  if (!contenedorGrid) return;

  contenedorGrid.innerHTML = "";

  if (lista.length === 0) {
    contenedorGrid.innerHTML = `<div class="col-12"><p class="text-muted text-center py-4">No se encontraron productos coincidentes.</p></div>`;
    return;
  }

  lista.forEach(producto => {
    const ahorroKwh = calcularAhorroKwhMes(producto.potenciaAnterior, producto.potenciaNueva, producto.horasUsoDia);
    const ahorroPesos = calcularAhorroPesosMes(ahorroKwh);

    const columna = document.createElement("div");
    columna.className = "col";
    columna.innerHTML = `
      <div class="card h-100 shadow-sm border-0">
        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-success-subtle text-success align-self-start mb-2">${obtenerNombreCategoria(producto.categoria)}</span>
          <h3 class="h5 card-title fw-bold">${producto.nombre}</h3>
          <p class="card-text text-muted small mb-2">
            Reemplaza: <strong>${producto.potenciaAnterior}W</strong> | Nuevo: <strong>${producto.potenciaNueva}W</strong>
          </p>
          <div class="bg-light p-2 rounded mb-3 small">
            <span class="text-success fw-bold">🍃 Ahorro estimado:</span> ${ahorroKwh.toFixed(1)} kWh/mes (${formatearMoneda(ahorroPesos)}/mes)
          </div>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="h5 fw-bold mb-0">${formatearMoneda(producto.precio)}</span>
            <button class="btn btn-primary btn-sm btn-agregar" data-id="${producto.id}">Agregar</button>
          </div>
        </div>
      </div>
    `;
    contenedorGrid.appendChild(columna);
  });

  asignarEventosAgregar();
}

// 4. Gestión del Carrito
function agregarAlCarrito(idProducto) {
  const productoEncontrado = productos.find(p => p.id === idProducto);
  if (productoEncontrado) {
    carrito.push(productoEncontrado);
    actualizarCarritoUI();
  }
}

function asignarEventosAgregar() {
  const botonesAgregar = document.querySelectorAll(".btn-agregar");
  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const id = parseInt(e.target.getAttribute("data-id"));
      agregarAlCarrito(id);
    });
  });
}

function actualizarCarritoUI() {
  const contenedorLista = document.querySelector("#lista-carrito");
  const totalElem = document.querySelector("#carrito-total");
  const ahorroElem = document.querySelector("#carrito-ahorro");
  const paybackElem = document.querySelector("#carrito-payback");

  if (!contenedorLista) return;

  contenedorLista.innerHTML = "";

  if (carrito.length === 0) {
    contenedorLista.innerHTML = `<p class="text-muted small">El carrito está vacío.</p>`;
    totalElem.textContent = "$ 0";
    ahorroElem.textContent = "$ 0";
    paybackElem.textContent = "0 meses";
    return;
  }

  let totalInversion = 0;
  let ahorroMensualTotal = 0;

  carrito.forEach((item, index) => {
    totalInversion += item.precio;
    const ahorroKwh = calcularAhorroKwhMes(item.potenciaAnterior, item.potenciaNueva, item.horasUsoDia);
    ahorroMensualTotal += calcularAhorroPesosMes(ahorroKwh);

    const elemento = document.createElement("div");
    elemento.className = "list-group-item d-flex justify-content-between align-items-center py-2 px-3";
    elemento.innerHTML = `
      <div>
        <h4 class="h6 mb-0 text-truncate" style="max-width: 160px;">${item.nombre}</h4>
        <small class="text-muted">${formatearMoneda(item.precio)}</small>
      </div>
      <button class="btn btn-outline-danger btn-sm px-2 py-0" onclick="eliminarDelCarrito(${index})">&times;</button>
    `;
    contenedorLista.appendChild(elemento);
  });

  totalElem.textContent = formatearMoneda(totalInversion);
  ahorroElem.textContent = formatearMoneda(ahorroMensualTotal);

  const mesesPayback = ahorroMensualTotal > 0 ? (totalInversion / ahorroMensualTotal).toFixed(1) : 0;
  paybackElem.textContent = `${mesesPayback} meses`;
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  actualizarCarritoUI();
}

// 5. Filtros y Buscador
document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos(productos);

  // Buscador por evento input
  const buscadorInput = document.querySelector("#campo-buscador");
  if (buscadorInput) {
    buscadorInput.addEventListener("input", (e) => {
      const texto = e.target.value.toLowerCase().trim();
      const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(texto));
      renderizarProductos(filtrados);
    });
  }

  // Filtros de categoría por evento click
  const botonesFiltro = document.querySelectorAll("#contenedor-filtros button");
  botonesFiltro.forEach(btn => {
    btn.addEventListener("click", (e) => {
      botonesFiltro.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const cat = e.target.getAttribute("data-categoria");
      if (cat === "Todas") {
        renderizarProductos(productos);
      } else {
        const filtrados = productos.filter(p => p.categoria === cat);
        renderizarProductos(filtrados);
      }
    });
  });

  // Botón Vaciar Carrito
  const btnVaciar = document.querySelector("#btn-vaciar");
  if (btnVaciar) {
    btnVaciar.addEventListener("click", () => {
      carrito = [];
      actualizarCarritoUI();
    });
  }