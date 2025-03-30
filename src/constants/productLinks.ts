/**
 * Enlaces directos a productos en Mercado Libre
 * Estos enlaces se utilizan en toda la aplicación para redirigir a los usuarios a las páginas de compra
 */

// Constantes para el estado de stock de los productos
export const STOCK_STATUS = {
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK'
};

// Objeto que contiene información completa de los productos
export const PRODUCT_INFO = {
  // Pack 5 Llaveros En Blanco
  PACK_5_LLAVEROS: {
    url: "https://articulo.mercadolibre.com.mx/MLM-2157742683-pack-5-llaveros-en-blanco-mini-cd-caja-disco-album-musical-_JM",
    status: STOCK_STATUS.IN_STOCK
  },
  
  // Pack 5 Llaveros NFC En Blanco
  PACK_5_LLAVEROS_NFC: {
    url: "https://articulo.mercadolibre.com.mx/MLM-3607288508-pack-5-llaveros-nfc-en-blanco-mini-cd-album-musical-disco-_JM",
    status: STOCK_STATUS.OUT_OF_STOCK
  },
  
  // Pack 25 Llaveros En Blanco
  PACK_25_LLAVEROS: {
    url: "https://articulo.mercadolibre.com.mx/MLM-3529953576-pack-25-llaveros-en-blanco-mini-cd-disco-album-musical-_JM",
    status: STOCK_STATUS.OUT_OF_STOCK
  },
  
  // Pack 50 Llaveros En Blanco
  PACK_50_LLAVEROS: {
    url: "https://articulo.mercadolibre.com.mx/MLM-2215776613-pack-50-llaveros-en-blanco-mini-cd-disco-album-musical-_JM",
    status: STOCK_STATUS.OUT_OF_STOCK
  }
};

// Para mantener retrocompatibilidad con el código existente, exportamos los enlaces individualmente
export const MERCADO_LIBRE_LINKS = {
  PACK_5_LLAVEROS: PRODUCT_INFO.PACK_5_LLAVEROS.url,
  PACK_5_LLAVEROS_NFC: PRODUCT_INFO.PACK_5_LLAVEROS_NFC.url,
  PACK_25_LLAVEROS: PRODUCT_INFO.PACK_25_LLAVEROS.url,
  PACK_50_LLAVEROS: PRODUCT_INFO.PACK_50_LLAVEROS.url
};

// También exportamos los enlaces individualmente para facilitar su uso
export const PACK_5_LLAVEROS = PRODUCT_INFO.PACK_5_LLAVEROS.url;
export const PACK_5_LLAVEROS_NFC = PRODUCT_INFO.PACK_5_LLAVEROS_NFC.url;
export const PACK_25_LLAVEROS = PRODUCT_INFO.PACK_25_LLAVEROS.url;
export const PACK_50_LLAVEROS = PRODUCT_INFO.PACK_50_LLAVEROS.url;

// Funciones de utilidad para comprobar el estado del stock
export const isInStock = (productKey: keyof typeof PRODUCT_INFO) => 
  PRODUCT_INFO[productKey].status === STOCK_STATUS.IN_STOCK; 