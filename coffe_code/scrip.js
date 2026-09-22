// Base de datos de productos para consulta del sistema
const menuProductos = [
  { id: 1, nombre: "Café Americano", precio: 40, categoria: "Bebida" },
  { id: 2, nombre: "Cappuccino", precio: 55, categoria: "Bebida" },
  { id: 3, nombre: "Latte Frío", precio: 60, categoria: "Bebida" },
  { id: 4, nombre: "Té Chai", precio: 48, categoria: "Bebida" },
  { id: 5, nombre: "Croissant de Jamón y Queso", precio: 65, categoria: "Alimento" },
  { id: 6, nombre: "Bagel de Pavo", precio: 75, categoria: "Alimento" },
  { id: 7, nombre: "Panini de Pollo", precio: 85, categoria: "Alimento" },
  { id: 8, nombre: "Rebanada de Pastel", precio: 50, categoria: "Alimento" }
];

// Arreglo global de pedidos
const listaPedidos = [];

// ==========================================
// MÓDULO 03: CLIENTE
// ==========================================
function crearNuevoPedido() {
  const select = document.getElementById("selectProducto");
  const cantidadInput = document.getElementById("inputCantidad");

  const idProducto = parseInt(select.value);
  const cantidad = parseInt(cantidadInput.value);

  // Investigar: find()
  const productoEncontrado = menuProductos.find(p => p.id === idProducto);

  if (productoEncontrado && !isNaN(cantidad) && cantidad > 0) {
    const nuevoPedido = {
      id: Date.now(),
      producto: productoEncontrado.nombre,
      precio: productoEncontrado.precio,
      categoria: productoEncontrado.categoria,
      cantidad: cantidad
    };

    listaPedidos.push(nuevoPedido);
    cantidadInput.value = 1; // Reiniciar contador

    // Actualizar Caja y Cocina de inmediato
    actualizarCaja();
    actualizarCocina(listaPedidos);
  } else {
    alert("Por favor ingresa una cantidad válida.");
  }
}

// ==========================================
// MÓDULO 01: CAJA (Tu Módulo: reduce & destructuring)
// ==========================================
function calcularTotales() {
  // Investigar: reduce() y Destructuring ({ precio, cantidad })
  const subtotal = listaPedidos.reduce((acum, pedido) => {
    const { precio, cantidad } = pedido;
    return acum + (precio * cantidad);
  }, 0);

  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return { subtotal, iva, total };
}

function actualizarCaja() {
  const listaCajaUI = document.getElementById("listaCajaUI");
  listaCajaUI.innerHTML = "";

  if (listaPedidos.length === 0) {
    listaCajaUI.innerHTML = "<li>Sin productos registrados.</li>";
    return;
  }

  // Mostrar lista en caja usando forEach y destructuring
  listaPedidos.forEach(pedido => {
    const { producto, cantidad, precio } = pedido;
    const li = document.createElement("li");
    li.textContent = `${producto} (x${cantidad}) — Subtotal: $${(precio * cantidad).toFixed(2)}`;
    listaCajaUI.appendChild(li);
  });

  // Calcular e imprimir en cuadros no editables
  const { subtotal, iva, total } = calcularTotales();

  document.getElementById("inputSubtotal").value = `$${subtotal.toFixed(2)}`;
  document.getElementById("inputIVA").value = `$${iva.toFixed(2)}`;
  document.getElementById("inputTotal").value = `$${total.toFixed(2)}`;
}

// ==========================================
// MÓDULO 02: COCINA / BARISTA (Filtros: filter)
// ==========================================
function actualizarCocina(pedidosAMostrar) {
  const listaCocinaUI = document.getElementById("listaCocinaUI");
  listaCocinaUI.innerHTML = "";

  if (pedidosAMostrar.length === 0) {
    listaCocinaUI.innerHTML = "<li>No hay pedidos en esta categoría.</li>";
    return;
  }

  pedidosAMostrar.forEach(({ producto, cantidad, categoria }) => {
    const li = document.createElement("li");
    li.textContent = `[${categoria}] Preparar: ${cantidad}x ${producto}`;
    listaCocinaUI.appendChild(li);
  });
}

// Investigar: filter()
function filtrarBaratos() {
  const baratos = listaPedidos.filter(p => p.precio < 60);
  actualizarCocina(baratos);
}

function filtrarCaros() {
  const caros = listaPedidos.filter(p => p.precio >= 60);
  actualizarCocina(caros);
}

function filtrarCategoria(cat) {
  const filtrados = listaPedidos.filter(p => p.categoria === cat);
  actualizarCocina(filtrados);
}

function mostrarTodosCocina() {
  actualizarCocina(listaPedidos);
}