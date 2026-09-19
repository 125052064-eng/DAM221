const listaPedidos = [];

let totalAcumuladoPesos = 0;

function agregarPedido(nombreProducto, cantidad, precioUnitario) {
  const subtotalPesos = cantidad * precioUnitario;

  const nuevoPedido = {
    producto: nombreProducto,
    cantidad: cantidad,
    subtotal: subtotalPesos
  };

  listaPedidos.push(nuevoPedido);

  totalAcumuladoPesos += subtotalPesos;

  renderizarCaja();
}

function renderizarCaja() {
  const listaUI = document.getElementById("listaUI");
  const cuadroTotal = document.getElementById("cuadroTotal");

  listaUI.innerHTML = "";

  listaPedidos.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.producto} (x${item.cantidad}) - Subtotal: $${item.subtotal.toFixed(2)}`;
    listaUI.appendChild(li);
  });

  cuadroTotal.value = `$${totalAcumuladoPesos.toFixed(2)}`;
}

function capturarPedido() {
  const selectProducto = document.getElementById("productoSelect");
  const inputCantidad = document.getElementById("cantidadInput");

  const opcionSeleccionada = selectProducto.options[selectProducto.selectedIndex];
  const nombre = opcionSeleccionada.value;
  const precio = parseFloat(opcionSeleccionada.getAttribute("data-precio"));
  const cantidad = parseInt(inputCantidad.value);

  if (!isNaN(cantidad) && cantidad > 0) {
    agregarPedido(nombre, cantidad, precio);
    
    inputCantidad.value = 1;
  } else {
    alert("Por favor ingresa una cantidad válida.");
  }
}