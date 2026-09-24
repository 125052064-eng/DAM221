// Funciones del cliente adaptadas desde cliente3.js y conectadas a pedidos.json.
import { preguntar, cargarProductos, cargarPedidos, guardarPedidos,
  mostrarProductos, IVA_PORCENTAJE } from './datos.js';

export function consultarProductos(menuRecibido) {
  console.log('PRODUCTOS DISPONIBLES');
  menuRecibido.forEach(producto => console.log(`[ID: ${producto.id}] - ${producto.nombre}`));
}

// Registra de manera persistente un pedido solicitado por el cliente.
export function crearPedido(idProducto, cantidad, menuRecibido, nombreCliente = 'Cliente') {
  const productoEncontrado = menuRecibido.find(item => item.id === Number(idProducto));
  if (!productoEncontrado) {
    console.log(`El producto con ID ${idProducto} no se encuentra en el menu.`);
    return null;
  }
  if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > productoEncontrado.stock) {
    console.log(`La cantidad debe ser entre 1 y ${productoEncontrado.stock}.`);
    return null;
  }
  const pedidos = cargarPedidos();
  const ahora = new Date();
  const folio = `CLI-${ahora.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)}-${pedidos.length + 1}`;
  const subtotal = Math.round(productoEncontrado.precio * cantidad * 100) / 100;
  const iva = Math.round(subtotal * IVA_PORCENTAJE * 100) / 100;
  const pedido = {
    folio, idPedido: pedidos.length + 1, fecha: ahora.toLocaleString('es-MX'),
    cliente: nombreCliente, productos: [{ productoId: productoEncontrado.id,
      nombre: productoEncontrado.nombre, cantidad, precio: productoEncontrado.precio, importe: subtotal }],
    subtotal, iva, total: Math.round((subtotal + iva) * 100) / 100,
    pago: 0, cambio: 0, estado: 'Pendiente',
  };
  pedidos.push(pedido);
  guardarPedidos(pedidos);
  console.log(`Pedido registrado: ${cantidad}x ${productoEncontrado.nombre}. Folio: ${folio}`);
  console.log(`Subtotal: $${subtotal.toFixed(2)} | IVA: $${iva.toFixed(2)} | Total: $${pedido.total.toFixed(2)}`);
  return pedido;
}

export function listarPedidos() {
  const pedidos = cargarPedidos();
  console.log('MIS PEDIDOS');
  if (!pedidos.length) { console.log('No tienes ningun pedido registrado.'); return; }
  pedidos.forEach(pedido => {
    console.log(`\nPedido ${pedido.folio} (${pedido.estado}) - Total: $${pedido.total.toFixed(2)}`);
    pedido.productos.forEach(item => console.log(`${item.cantidad} unidad(es) de ${item.nombre}`));
  });
}

export function obtenerMenuDinamico(menuRecibido) {
  return menuRecibido.map(producto => ({ id: producto.id,
    nombreFormateado: `Producto #${producto.id}: ${producto.nombre.toUpperCase()}`,
    precio: producto.precio || 0, stock: producto.stock }));
}

export function mostrarProductosDisponibles(menuRecibido) {
  console.log('LISTA DE PRODUCTOS DISPONIBLES');
  menuRecibido.forEach(producto => console.log(
    `- [ID: ${producto.id}] ${producto.nombre} | Precio: $${producto.precio || 0} | Disponibles: ${producto.stock}`));
}

export function mostrarPromociones(menuRecibido, porcentajeDescuento = 10) {
  console.log(`PROMOCIONES DEL DIA (${porcentajeDescuento}% DE DESCUENTO)`);
  menuRecibido.forEach(producto => {
    const precioBase = producto.precio || 0;
    const precioOferta = precioBase * (1 - porcentajeDescuento / 100);
    console.log(`¡OFERTA! ${producto.nombre} - De $${precioBase.toFixed(2)} a $${precioOferta.toFixed(2)}`);
  });
}

export async function simularEstadoPedido(idPedido, estadoFinal = 'Listo') {
  const pedidos = cargarPedidos();
  const pedido = pedidos.find(p => p.idPedido === Number(idPedido) || p.folio === idPedido);
  if (!pedido) { console.log(`No se encontro el pedido #${idPedido} para hacer el seguimiento.`); return; }
  console.log(`SEGUIMIENTO DEL PEDIDO ${pedido.folio} (${pedido.productos.map(p => p.nombre).join(', ')})`);
  for (const estado of ['Recibido', 'Preparando', 'Empacando', estadoFinal]) {
    console.log(`Pedido ${pedido.folio}: ${estado}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  console.log(`Estado guardado actualmente: ${pedido.estado}`);
}

export async function menu() {
  while (true) {
    console.log('\n========== CLIENTE ==========\n1. Ver productos disponibles\n2. Crear pedido\n3. Consultar mis pedidos');
    console.log('4. Seguir un pedido\n5. Ver promociones\n0. Salir');
    const opcion = await preguntar('Selecciona: ');
    if (opcion === '1') mostrarProductosDisponibles(cargarProductos());
    else if (opcion === '2') {
      const productos = cargarProductos();
      mostrarProductos(productos);
      const id = Number(await preguntar('ID del producto: '));
      const producto = productos.find(p => p.id === id);
      if (!producto) { console.log('No existe ese producto.'); continue; }
      const cantidadTexto = await preguntar(`Cantidad (disponible ${producto.stock}): `);
      const cantidad = Number(cantidadTexto);
      const nombre = (await preguntar('Nombre del cliente: ')) || 'Cliente';
      crearPedido(id, cantidad, productos, nombre);
    } else if (opcion === '3') listarPedidos();
    else if (opcion === '4') {
      listarPedidos();
      const folio = await preguntar('Escribe el folio del pedido a seguir: ');
      await simularEstadoPedido(folio);
    } else if (opcion === '5') mostrarPromociones(cargarProductos());
    else if (opcion === '0') break;
    else console.log('Opcion no valida.');
  }
}
