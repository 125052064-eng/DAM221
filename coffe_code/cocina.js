// Modulo de cocina: consultas, filtros y mantenimiento del inventario.
import { preguntar, cargarProductos, guardarProductos, mostrarProductos,
  pedirEntero, pedirDinero } from './datos.js';

export async function menu() {
  while (true) {
    const productos = cargarProductos();
    console.log('\n========== COCINA / INVENTARIO ==========');
    console.log('1. Ver todos\n2. Buscar por nombre o categoria\n3. Productos baratos (5 menor precio)');
    console.log('4. Productos caros (5 mayor precio)\n5. Bebidas\n6. Postres');
    console.log('7. Agregar producto\n8. Actualizar existencias\n0. Salir');
    const opcion = await preguntar('Selecciona: ');
    if (opcion === '1') mostrarProductos(productos);
    else if (opcion === '2') {
      const texto = (await preguntar('Escribe nombre o categoria: ')).toLocaleLowerCase('es-MX');
      mostrarProductos(productos.filter(p => p.nombre.toLocaleLowerCase('es-MX').includes(texto)
        || p.categoria.toLocaleLowerCase('es-MX').includes(texto)));
    } else if (opcion === '3') mostrarProductos([...productos].sort((a, b) => a.precio - b.precio).slice(0, 5));
    else if (opcion === '4') mostrarProductos([...productos].sort((a, b) => b.precio - a.precio).slice(0, 5));
    else if (opcion === '5' || opcion === '6') {
      const categoria = opcion === '5' ? 'bebidas' : 'postres';
      mostrarProductos(productos.filter(p => p.categoria.toLowerCase() === categoria));
    } else if (opcion === '7') {
      const nombre = await preguntar('Nombre del producto: ');
      const categoria = await preguntar('Categoria: ');
      if (!nombre || !categoria) { console.log('Nombre y categoria son obligatorios.'); continue; }
      const precio = await pedirDinero('Precio: $');
      const stock = await pedirEntero('Existencias: ');
      const id = Math.max(0, ...productos.map(p => p.id)) + 1;
      productos.push({ id, nombre, categoria, precio, stock });
      guardarProductos(productos);
      console.log('Producto agregado al inventario.');
    } else if (opcion === '8') {
      mostrarProductos(productos);
      const id = await pedirEntero('ID de producto: ', 1);
      const producto = productos.find(p => p.id === id);
      if (!producto) console.log('No se encontro ese ID.');
      else {
        producto.stock = await pedirEntero('Nueva cantidad disponible: ');
        guardarProductos(productos);
        console.log('Existencias actualizadas.');
      }
    } else if (opcion === '0') break;
    else console.log('Opcion no valida.');
  }
}
