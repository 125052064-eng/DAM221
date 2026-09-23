"""Sistema sencillo de inventario y ventas para ejecutar desde VS Code.

Guarda el inventario en inventario.json y cada venta en la carpeta tickets/.
No necesita instalar librerias externas.
"""

import json
from datetime import datetime
from pathlib import Path


ARCHIVO_DATOS = Path(__file__).with_name("inventario.json")
CARPETA_TICKETS = Path(__file__).with_name("tickets")
IVA = 0.16

PRODUCTOS_INICIALES = [
    {"id": 1, "nombre": "Agua natural", "categoria": "Bebidas", "precio": 15.0, "stock": 20},
    {"id": 2, "nombre": "Refresco", "categoria": "Bebidas", "precio": 22.0, "stock": 15},
    {"id": 3, "nombre": "Pastel de chocolate", "categoria": "Postres", "precio": 45.0, "stock": 8},
    {"id": 4, "nombre": "Galletas", "categoria": "Postres", "precio": 18.0, "stock": 12},
    {"id": 5, "nombre": "Sandwich", "categoria": "Comida", "precio": 38.0, "stock": 10},
]


def guardar(productos):
    ARCHIVO_DATOS.write_text(json.dumps(productos, ensure_ascii=False, indent=2), encoding="utf-8")


def cargar():
    if not ARCHIVO_DATOS.exists():
        guardar(PRODUCTOS_INICIALES)
    try:
        return json.loads(ARCHIVO_DATOS.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        print("No se pudo leer inventario.json. Se cargara el inventario de ejemplo.")
        return PRODUCTOS_INICIALES.copy()


def pedir_entero(mensaje, minimo=0):
    while True:
        try:
            valor = int(input(mensaje))
            if valor >= minimo:
                return valor
        except ValueError:
            pass
        print(f"Escribe un numero entero igual o mayor que {minimo}.")


def pedir_precio(mensaje):
    while True:
        try:
            valor = float(input(mensaje).replace(",", "."))
            if valor >= 0:
                return round(valor, 2)
        except ValueError:
            pass
        print("Escribe un precio valido, por ejemplo 25.50.")


def mostrar_productos(productos):
    if not productos:
        print("No hay productos para mostrar.")
        return
    print("\n{:<5} {:<25} {:<15} {:>10} {:>8}".format("ID", "PRODUCTO", "CATEGORIA", "PRECIO", "STOCK"))
    print("-" * 68)
    for p in productos:
        print("{:<5} {:<25} {:<15} ${:>9.2f} {:>8}".format(
            p["id"], p["nombre"][:24], p["categoria"][:14], p["precio"], p["stock"]
        ))


def agregar_producto(productos):
    print("\n--- Agregar producto ---")
    nombre = input("Nombre: ").strip()
    categoria = input("Categoria (Bebidas, Postres, Comida, etc.): ").strip()
    if not nombre or not categoria:
        print("El nombre y la categoria son obligatorios.")
        return
    nuevo_id = max((p["id"] for p in productos), default=0) + 1
    productos.append({"id": nuevo_id, "nombre": nombre, "categoria": categoria,
                      "precio": pedir_precio("Precio: $"), "stock": pedir_entero("Existencias: ")})
    guardar(productos)
    print("Producto agregado y guardado.")


def buscar_productos(productos):
    texto = input("Nombre o categoria para buscar: ").strip().casefold()
    encontrados = [p for p in productos if texto in p["nombre"].casefold() or texto in p["categoria"].casefold()]
    mostrar_productos(encontrados)


def menu_cocina(productos):
    while True:
        print("\n--- Cocina / filtros de productos ---")
        print("1. Ver todos   2. Buscar   3. Productos baratos   4. Productos caros")
        print("5. Bebidas     6. Postres  0. Volver")
        op = input("Elige: ").strip()
        if op == "1":
            mostrar_productos(productos)
        elif op == "2":
            buscar_productos(productos)
        elif op == "3":
            mostrar_productos(sorted(productos, key=lambda p: p["precio"])[:5])
        elif op == "4":
            mostrar_productos(sorted(productos, key=lambda p: p["precio"], reverse=True)[:5])
        elif op in ("5", "6"):
            categoria = "Bebidas" if op == "5" else "Postres"
            mostrar_productos([p for p in productos if p["categoria"].casefold() == categoria.casefold()])
        elif op == "0":
            break
        else:
            print("Opcion no valida.")


def guardar_ticket(cliente, lineas, subtotal, iva, total, recibido, cambio):
    CARPETA_TICKETS.mkdir(exist_ok=True)
    ahora = datetime.now()
    folio = ahora.strftime("%Y%m%d-%H%M%S")
    ruta = CARPETA_TICKETS / f"ticket-{folio}.txt"
    contenido = ["=" * 40, "           TICKET DE VENTA", "       Tienda escolar", "=" * 40,
                 f"Folio: {folio}", f"Fecha: {ahora.strftime('%d/%m/%Y %H:%M:%S')}",
                 f"Cliente: {cliente}", "-" * 40, "Producto             Cant.   Importe", "-" * 40]
    contenido.extend(lineas)
    contenido += ["-" * 40, f"Subtotal:                 ${subtotal:>8.2f}",
                  f"IVA ({IVA:.0%}):                  ${iva:>8.2f}", f"TOTAL:                    ${total:>8.2f}",
                  f"Pago recibido:            ${recibido:>8.2f}", f"Cambio:                   ${cambio:>8.2f}",
                  "=" * 40, "       Gracias por su compra", "=" * 40]
    ruta.write_text("\n".join(contenido), encoding="utf-8")
    return ruta, "\n".join(contenido)


def crear_pedido(productos):
    print("\n--- Nuevo pedido / caja ---")
    cliente = input("Nombre del cliente (Enter = Mostrador): ").strip() or "Mostrador"
    carrito = {}
    while True:
        mostrar_productos(productos)
        print("Escribe el ID del producto para agregarlo, 0 para terminar el pedido.")
        pid = pedir_entero("ID: ")
        if pid == 0:
            break
        producto = next((p for p in productos if p["id"] == pid), None)
        if producto is None:
            print("No existe ese ID.")
            continue
        disponible = producto["stock"] - carrito.get(pid, 0)
        if disponible <= 0:
            print("Ya no hay mas existencias disponibles para este pedido.")
            continue
        cantidad = pedir_entero(f"Cantidad (disponible {disponible}): ", 1)
        if cantidad > disponible:
            print("No hay suficiente inventario.")
            continue
        carrito[pid] = carrito.get(pid, 0) + cantidad
        print("Producto agregado al pedido.")
    if not carrito:
        print("Pedido vacio; no se genero ticket.")
        return

    subtotal = sum(next(p["precio"] for p in productos if p["id"] == pid) * cant for pid, cant in carrito.items())
    iva = round(subtotal * IVA, 2)
    total = round(subtotal + iva, 2)
    print(f"\nSubtotal: ${subtotal:.2f} | IVA: ${iva:.2f} | Total: ${total:.2f}")
    while True:
        recibido = pedir_precio("Pago recibido: $")
        if recibido >= total:
            break
        print(f"El pago no alcanza. Faltan ${total - recibido:.2f}.")
    cambio = round(recibido - total, 2)
    lineas = []
    for pid, cantidad in carrito.items():
        p = next(p for p in productos if p["id"] == pid)
        importe = p["precio"] * cantidad
        lineas.append(f"{p['nombre'][:20]:<20} {cantidad:>4}   ${importe:>8.2f}")
    ruta, ticket = guardar_ticket(cliente, lineas, subtotal, iva, total, recibido, cambio)
    for pid, cantidad in carrito.items():
        next(p for p in productos if p["id"] == pid)["stock"] -= cantidad
    guardar(productos)
    print("\n" + ticket)
    print(f"\nTicket guardado en: {ruta}")


def menu_inventario(productos):
    while True:
        print("\n--- Inventario ---")
        print("1. Ver productos   2. Agregar producto   3. Buscar producto")
        print("4. Ajustar existencias   0. Volver")
        op = input("Elige: ").strip()
        if op == "1":
            mostrar_productos(productos)
        elif op == "2":
            agregar_producto(productos)
        elif op == "3":
            buscar_productos(productos)
        elif op == "4":
            mostrar_productos(productos)
            pid = pedir_entero("ID del producto: ", 1)
            p = next((x for x in productos if x["id"] == pid), None)
            if p:
                p["stock"] = pedir_entero("Nueva cantidad en existencia: ")
                guardar(productos)
                print("Existencias actualizadas.")
            else:
                print("No existe ese ID.")
        elif op == "0":
            break
        else:
            print("Opcion no valida.")


def main():
    productos = cargar()
    while True:
        print("\n====================================")
        print(" SISTEMA DE VENTAS E INVENTARIO")
        print("====================================")
        print("1. Caja: crear pedido y cobrar")
        print("2. Inventario: agregar y administrar productos")
        print("3. Cocina: filtrar productos")
        print("0. Salir")
        opcion = input("Selecciona una opcion: ").strip()
        if opcion == "1":
            crear_pedido(productos)
        elif opcion == "2":
            menu_inventario(productos)
        elif opcion == "3":
            menu_cocina(productos)
        elif opcion == "0":
            print("Cambios guardados. Hasta luego.")
            break
        else:
            print("Opcion no valida.")


if __name__ == "__main__":
    main()
