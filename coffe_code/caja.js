// Modulo de caja: cobro, cancelaciones, reposicion de inventario y tickets.
import { preguntar, IVA_PORCENTAJE, cargarProductos, guardarProductos,
  cargarPedidos, guardarPedidos, pedirEntero, pedirDinero, mostrarProductos,
  generarTicket } from './datos.js';

export async function nuevoPedido() {
  const productos = cargarProductos();
  const pedidos = cargarPedidos();
  const cliente = (await preguntar('Nombre del cliente (Enter = Mostrador): ')) || 'Mostrador';
  const carrito = new Map();
  while (true) {
    mostrarProductos(productos);
    console.log('Agrega el ID de un producto; escribe 0 para terminar.');
    const id = await pedirEntero('ID: ');
    if (id === 0) break;
    const producto = productos.find(p => p.id === id);
    if (!producto) { console.log('No existe ese producto.'); continue; }
    const disponible = producto.stock - (carrito.get(id) || 0);
    if (disponible <= 0) { console.log('No quedan unidades disponibles para agregar.'); continue; }
    const cantidad = await pedirEntero(`Cantidad (disponible ${disponible}): `, 1);
    if (cantidad > disponible) { console.log('No hay suficiente inventario.'); continue; }
    carrito.set(id, (carrito.get(id) || 0) + cantidad);
    console.log('Producto agregado.');
  }
  if (!carrito.size) { console.log('Pedido vacio. No se genero venta.'); return; }

  const detalle = [...carrito].map(([id, cantidad]) => {
    const producto = productos.find(p => p.id === id);
    return { productoId: id, nombre: producto.nombre, cantidad, precio: producto.precio,
      importe: Math.round(producto.precio * cantidad * 100) / 100 };
  });
  const subtotal = Math.round(detalle.reduce((suma, item) => suma + item.importe, 0) * 100) / 100;
  const iva = Math.round(subtotal * IVA_PORCENTAJE * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;
  console.log(`\nSubtotal: $${subtotal.toFixed(2)} | IVA: $${iva.toFixed(2)} | TOTAL: $${total.toFixed(2)}`);
  const pago = await pedirDinero('Pago recibido: $', total);
  const ahora = new Date();
  const folio = `${ahora.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)}-${String(ahora.getMilliseconds()).padStart(3, '0')}`;
  const pedido = { folio, fecha: ahora.toLocaleString('es-MX'), cliente, productos: detalle,
    subtotal, iva, total, pago, cambio: Math.round((pago - total) * 100) / 100, estado: 'Listo' };
  carrito.forEach((cantidad, id) => { productos.find(p => p.id === id).stock -= cantidad; });
  guardarProductos(productos);
  pedidos.push(pedido);
  guardarPedidos(pedidos);
  const ticket = generarTicket(pedido);
  console.log(`\n${ticket.contenido}\nTicket guardado en: ${ticket.archivo}`);
  console.log('El pedido aparece como LISTO en el modulo de cliente.');
}

export async function cancelarPedido() {
  const pedidos = cargarPedidos();
  const cancelables = pedidos.filter(p => ['listo', 'pendiente'].includes(p.estado.toLowerCase()));
  if (!cancelables.length) { console.log('No hay pedidos pendientes o listos para cancelar.'); return; }
  cancelables.forEach(p => console.log(`Folio ${p.folio} | ${p.cliente} | ${p.estado} | $${p.total.toFixed(2)}`));
  const folio = await preguntar('Folio del pedido que deseas cancelar: ');
  const pedido = pedidos.find(p => p.folio === folio && ['Listo', 'Pendiente'].includes(p.estado));
  if (!pedido) { console.log('No se encontro un pedido pendiente o listo con ese folio.'); return; }
  const productos = cargarProductos();
  const fueCobrado = pedido.estado === 'Listo';
  if (fueCobrado) pedido.productos.forEach(vendido => {
    const producto = productos.find(p => p.id === vendido.productoId);
    if (producto) producto.stock += vendido.cantidad;
  });
  pedido.estado = 'Cancelado';
  guardarProductos(productos);
  guardarPedidos(pedidos);
  generarTicket(pedido);
  console.log(fueCobrado
    ? 'Pedido cancelado, existencias repuestas y ticket actualizado.'
    : 'Pedido cancelado y ticket actualizado.');
}

export async function cobrarPedidoCliente() {
  const pedidos = cargarPedidos();
  const pendientes = pedidos.filter(p => p.estado.toLowerCase() === 'pendiente');
  if (!pendientes.length) { console.log('No hay pedidos de cliente pendientes de cobro.'); return; }
  pendientes.forEach(p => console.log(`Folio ${p.folio} | ${p.cliente} | Total: $${p.total.toFixed(2)}`));
  const folio = await preguntar('Folio del pedido que vas a cobrar: ');
  const pedido = pedidos.find(p => p.folio === folio && p.estado.toLowerCase() === 'pendiente');
  if (!pedido) { console.log('No se encontro ese pedido pendiente.'); return; }
  const productos = cargarProductos();
  for (const item of pedido.productos) {
    const producto = productos.find(p => p.id === item.productoId);
    if (!producto || producto.stock < item.cantidad) {
      console.log(`No hay existencias suficientes de ${item.nombre}. No se cobro el pedido.`);
      return;
    }
  }
  const pago = await pedirDinero(`Total a cobrar $${pedido.total.toFixed(2)}. Pago recibido: $`, pedido.total);
  pedido.pago = pago;
  pedido.cambio = Math.round((pago - pedido.total) * 100) / 100;
  pedido.estado = 'Listo';
  pedido.productos.forEach(item => {
    const producto = productos.find(p => p.id === item.productoId);
    producto.stock -= item.cantidad;
  });
  guardarProductos(productos);
  guardarPedidos(pedidos);
  const ticket = generarTicket(pedido);
  console.log(`\n${ticket.contenido}\nTicket guardado en: ${ticket.archivo}`);
}

export async function menu() {
  while (true) {
    console.log('\n========== CAJA ==========\n1. Nueva venta\n2. Cobrar pedido de cliente\n3. Cancelar pedido\n0. Salir');
    const opcion = await preguntar('Selecciona: ');
    if (opcion === '1') await nuevoPedido();
    else if (opcion === '2') await cobrarPedidoCliente();
    else if (opcion === '3') await cancelarPedido();
    else if (opcion === '0') break;
    else console.log('Opcion no valida.');
  }
}
