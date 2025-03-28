# Sistema de Gestión de Stock para MiniCDWorld

Este sistema permite gestionar fácilmente el estado de disponibilidad (stock) de los productos en la web de MiniCDWorld.

## Estructura

El sistema se compone de los siguientes elementos:

1. **Archivo de constantes** (`src/constants/productLinks.ts`): Almacena enlaces y estado de stock de los productos
2. **Script de actualización** (`update-stock.js`): Permite actualizar el estado de stock desde la línea de comandos

## Cómo funciona

### Estado de Stock

En el archivo `src/constants/productLinks.ts`, cada producto tiene un estado de stock definido que puede ser:

- `IN_STOCK`: Producto disponible
- `OUT_OF_STOCK`: Producto agotado

La interfaz de usuario se adaptará automáticamente según estos valores:

- Los productos en stock mostrarán el botón "Comprar ahora" y se etiquetarán como "En stock"
- Los productos agotados mostrarán un mensaje de "Agotado" y no serán clickeables

### Actualización Manual

Para actualizar manualmente el estado de stock, puedes editar directamente el archivo `src/constants/productLinks.ts` y cambiar el campo `status` de cualquier producto a `STOCK_STATUS.IN_STOCK` o `STOCK_STATUS.OUT_OF_STOCK`.

```typescript
// Ejemplo para establecer PACK_25_LLAVEROS como agotado
PACK_25_LLAVEROS: {
  url: "https://articulo.mercadolibre.com.mx/MLM-3529953576-pack-25-llaveros-en-blanco-mini-cd-disco-album-musical-_JM",
  status: STOCK_STATUS.OUT_OF_STOCK
},
```

### Usando el Script de Actualización

Para facilitar la actualización del stock, puedes usar el script `update-stock.js`:

```bash
node update-stock.js <PRODUCT_KEY> <STATUS>
```

Donde:
- `<PRODUCT_KEY>` es uno de: `PACK_5_LLAVEROS`, `PACK_5_LLAVEROS_NFC`, `PACK_25_LLAVEROS`, `PACK_50_LLAVEROS`
- `<STATUS>` es uno de: `IN_STOCK`, `OUT_OF_STOCK`

Por ejemplo:

```bash
# Establecer PACK_25_LLAVEROS como agotado
node update-stock.js PACK_25_LLAVEROS OUT_OF_STOCK

# Establecer PACK_5_LLAVEROS_NFC como disponible
node update-stock.js PACK_5_LLAVEROS_NFC IN_STOCK
```

El script actualizará automáticamente el archivo y realizará un commit y push a GitHub con un mensaje descriptivo.

## Impacto en la UI

La actualización del estado de stock afecta a:

1. **Página de Inicio**: Los productos agotados se mostrarán con una etiqueta de "Agotado" y no permitirán clicks.
2. **Página de Compra**: Los productos agotados se mostrarán con la etiqueta correspondiente y el botón de compra estará deshabilitado.

## Notas Adicionales

- Los cambios en el estado de stock se reflejan en tiempo real tras actualizar la página
- No es necesario reiniciar el servidor de desarrollo
- El script automatiza la subida a GitHub para que los cambios se desplieguen automáticamente 