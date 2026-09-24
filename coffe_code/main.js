// Punto de entrada de la aplicacion (ES Modules).
import { menu as menuCaja } from './caja.js';
import { menu as menuCliente } from './cliente.js';
import { menu as menuCocina } from './cocina.js';
import { preguntar, interfaz } from './datos.js';

async function main() {
  while (true) {
    console.log('\n====================================\n SISTEMA DE VENTAS DE TIENDA\n====================================');
    console.log('1. Caja\n2. Cliente\n3. Cocina e inventario\n0. Salir');
    const opcion = await preguntar('Selecciona un modulo: ');
    if (opcion === '1') await menuCaja();
    else if (opcion === '2') await menuCliente();
    else if (opcion === '3') await menuCocina();
    else if (opcion === '0') { console.log('Hasta luego.'); break; }
    else console.log('Opcion no valida.');
  }
}

main().catch(error => console.error('Ocurrio un error:', error.message))
  .finally(() => interfaz.close());
