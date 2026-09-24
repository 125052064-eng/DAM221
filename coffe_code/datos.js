// Utilidades compartidas. Todos los modulos usan import/export (ES Modules).
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
export const BASE = path.dirname(__filename);
export const ARCHIVO_PRODUCTOS = path.join(BASE, 'inventario.json');
export const ARCHIVO_PEDIDOS = path.join(BASE, 'pedidos.json');
export const CARPETA_TICKETS = path.join(BASE, 'tickets');
export const IVA_PORCENTAJE = 0.16;
export const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Agua natural', categoria: 'Bebidas', precio: 15, stock: 20 },
  { id: 2, nombre: 'Refresco', categoria: 'Bebidas', precio: 22, stock: 15 },
  { id: 3, nombre: 'Pastel de chocolate', categoria: 'Postres', precio: 45, stock: 8 },
  { id: 4, nombre: 'Galletas', categoria: 'Postres', precio: 18, stock: 12 },
  { id: 5, nombre: 'Sandwich', categoria: 'Comida', precio: 38, stock: 10 },
];

export const interfaz = readline.createInterface({ input: process.stdin, output: process.stdout });
export function preguntar(texto) {
  return new Promise(resolve => interfaz.question(texto, respuesta => resolve(respuesta.trim())));
}
export function leerJson(archivo, predeterminado) {
  if (!fs.existsSync(archivo)) escribirJson(archivo, predeterminado);
  try { return JSON.parse(fs.readFileSync(archivo, 'utf8')); }
  catch {
    console.log(`No se pudo leer ${path.basename(archivo)}; se usaran datos iniciales.`);
    return structuredClone(predeterminado);
  }
}
export function escribirJson(archivo, datos) {
  fs.writeFileSync(archivo, JSON.stringify(datos, null, 2), 'utf8');
}
export function cargarProductos() { return leerJson(ARCHIVO_PRODUCTOS, PRODUCTOS_INICIALES); }
export function guardarProductos(productos) { escribirJson(ARCHIVO_PRODUCTOS, productos); }
export function cargarPedidos() { return leerJson(ARCHIVO_PEDIDOS, []); }
export function guardarPedidos(pedidos) { escribirJson(ARCHIVO_PEDIDOS, pedidos); }
export async function pedirEntero(texto, minimo = 0) {
  while (true) {
    const valor = Number(await preguntar(texto));
    if (Number.isInteger(valor) && valor >= minimo) return valor;
    console.log(`Escribe un numero entero igual o mayor que ${minimo}.`);
  }
}
export async function pedirDinero(texto, minimo = 0) {
  while (true) {
    const valor = Number((await preguntar(texto)).replace(',', '.'));
    if (Number.isFinite(valor) && valor >= minimo) return Math.round((valor + Number.EPSILON) * 100) / 100;
    console.log(`Escribe una cantidad valida igual o mayor que $${minimo.toFixed(2)}.`);
  }
}
export function mostrarProductos(productos) {
  if (!productos.length) { console.log('No hay productos para mostrar.'); return; }
  console.log('\nID   PRODUCTO                  CATEGORIA          PRECIO    STOCK');
  console.log('-'.repeat(68));
  productos.forEach(p => console.log(
    `${String(p.id).padEnd(5)}${p.nombre.slice(0, 24).padEnd(25)}${p.categoria.slice(0, 14).padEnd(15)}$${p.precio.toFixed(2).padStart(9)}${String(p.stock).padStart(8)}`
  ));
}
export function generarTicket(pedido) {
  fs.mkdirSync(CARPETA_TICKETS, { recursive: true });
  const archivo = path.join(CARPETA_TICKETS, `ticket-${pedido.folio}.txt`);
  const filas = ['='.repeat(44), '             TICKET DE VENTA', '              Tienda escolar', '='.repeat(44),
    `Folio: ${pedido.folio}`, `Fecha: ${pedido.fecha}`, `Cliente: ${pedido.cliente}`,
    '-'.repeat(44), 'Producto                  Cant.    Importe', '-'.repeat(44)];
  pedido.productos.forEach(item => filas.push(
    `${item.nombre.slice(0, 24).padEnd(24)}${String(item.cantidad).padStart(5)}    $${item.importe.toFixed(2).padStart(8)}`));
  filas.push('-'.repeat(44), `Subtotal:                       $${pedido.subtotal.toFixed(2).padStart(8)}`,
    `IVA (16%):                       $${pedido.iva.toFixed(2).padStart(8)}`,
    `TOTAL:                           $${pedido.total.toFixed(2).padStart(8)}`,
    `Pago recibido:                   $${Number(pedido.pago || 0).toFixed(2).padStart(8)}`,
    `Cambio:                          $${Number(pedido.cambio || 0).toFixed(2).padStart(8)}`,
    `Estado del pedido: ${pedido.estado}`, '='.repeat(44), '          Gracias por su compra', '='.repeat(44));
  const contenido = filas.join('\n');
  fs.writeFileSync(archivo, contenido, 'utf8');
  return { archivo, contenido };
}
