# Inventario de productos

Aplicación web para registrar, consultar, editar y eliminar productos de un inventario. Los datos se guardan en el navegador mediante `localStorage`.

## Ejecutar

Desde la carpeta del repositorio:

```sh
python -m http.server 8000
```

Abre http://localhost:8000. La aplicación no requiere dependencias ni una cuenta para probarla. El navegador conserva los datos al recargar en el mismo origen.

## Flujo de ramas

La práctica usa `dev` para integración, `qa` para validación y `main` para la entrega. Cada cambio se promueve desde su misma rama de trabajo mediante tres pull requests, uno hacia cada destino en ese orden.

| Rama | Cambio |
| --- | --- |
| `feature/registrar-productos` | Registro y almacenamiento |
| `feature/listar-productos` | Tabla y estado vacío |
| `feature/editar-productos` | Edición con validación |
| `feature/eliminar-productos` | Eliminación con confirmación |
| `feature/filtrar-productos` | Búsqueda y resumen de existencias |

## Comprobación manual

1. Registra un producto y recarga la página. Debe seguir en la tabla.
2. Intenta guardar un código repetido, una cantidad negativa o un precio inválido.
3. Edita el nombre o la cantidad y comprueba los datos al recargar.
4. Busca por nombre, código o categoría y prueba una consulta sin coincidencias.
5. Cancela una eliminación y verifica que el producto permanece. Confirma la eliminación y recarga.
