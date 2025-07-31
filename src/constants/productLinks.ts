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
  // Pack 5 Llaveros En Blanco con NFC
  PACK_5_LLAVEROS_NFC: {
    url: "https://articulo.mercadolibre.com.mx/MLM-2157742683-pack-5-llaveros-en-blanco-mini-cd-caja-disco-album-musical-_JM",
    status: STOCK_STATUS.IN_STOCK
  },
  
  // Pack 10 Llaveros En Blanco con NFC
  PACK_10_LLAVEROS_NFC: {
    url: "https://articulo.mercadolibre.com.mx/MLM-3860151350-pack-10-llaveros-en-blanco-mini-cd-caja-disco-album-musical-_JM",
    status: STOCK_STATUS.IN_STOCK
  },
  
  // Pack 20 Llaveros En Blanco con NFC
  PACK_20_LLAVEROS_NFC: {
    url: "https://articulo.mercadolibre.com.mx/MLM-2378817651-pack-20-llaveros-en-blanco-mini-cd-caja-disco-album-musical-_JM",
    status: STOCK_STATUS.IN_STOCK
  },
  
  // Pack 30 Llaveros En Blanco con NFC
  PACK_30_LLAVEROS_NFC: {
    url: "https://articulo.mercadolibre.com.mx/MLM-2291529641-pack-30-llaveros-en-blanco-mini-cd-caja-disco-album-musical-_JM",
    status: STOCK_STATUS.IN_STOCK
  },
  
  // Pack 40 Llaveros En Blanco con NFC
  PACK_40_LLAVEROS_NFC: {
    url: "https://articulo.mercadolibre.com.mx/MLM-3701144176-pack-40-llaveros-en-blanco-mini-cd-caja-disco-album-musical-_JM",
    status: STOCK_STATUS.IN_STOCK
  },
  
  // Pack 5 Llaveros En Blanco con NFC - Envío FULL
  PACK_5_LLAVEROS_NFC_FULL: {
    url: "https://articulo.mercadolibre.com.mx/MLM-3607288508-pack-5-llaveros-nfc-en-blanco-mini-cd-album-musical-disco-_JM",
    status: STOCK_STATUS.OUT_OF_STOCK
  }
};

// Para mantener retrocompatibilidad con el código existente, exportamos los enlaces individualmente
export const MERCADO_LIBRE_LINKS = {
  PACK_5_LLAVEROS_NFC: PRODUCT_INFO.PACK_5_LLAVEROS_NFC.url,
  PACK_10_LLAVEROS_NFC: PRODUCT_INFO.PACK_10_LLAVEROS_NFC.url,
  PACK_20_LLAVEROS_NFC: PRODUCT_INFO.PACK_20_LLAVEROS_NFC.url,
  PACK_30_LLAVEROS_NFC: PRODUCT_INFO.PACK_30_LLAVEROS_NFC.url,
  PACK_40_LLAVEROS_NFC: PRODUCT_INFO.PACK_40_LLAVEROS_NFC.url,
  PACK_5_LLAVEROS_NFC_FULL: PRODUCT_INFO.PACK_5_LLAVEROS_NFC_FULL.url
};

// También exportamos los enlaces individualmente para facilitar su uso
export const PACK_5_LLAVEROS_NFC = PRODUCT_INFO.PACK_5_LLAVEROS_NFC.url;
export const PACK_10_LLAVEROS_NFC = PRODUCT_INFO.PACK_10_LLAVEROS_NFC.url;
export const PACK_20_LLAVEROS_NFC = PRODUCT_INFO.PACK_20_LLAVEROS_NFC.url;
export const PACK_30_LLAVEROS_NFC = PRODUCT_INFO.PACK_30_LLAVEROS_NFC.url;
export const PACK_40_LLAVEROS_NFC = PRODUCT_INFO.PACK_40_LLAVEROS_NFC.url;
export const PACK_5_LLAVEROS_NFC_FULL = PRODUCT_INFO.PACK_5_LLAVEROS_NFC_FULL.url;

// Funciones de utilidad para comprobar el estado del stock
export const isInStock = (productKey: keyof typeof PRODUCT_INFO) => 
  PRODUCT_INFO[productKey].status === STOCK_STATUS.IN_STOCK;