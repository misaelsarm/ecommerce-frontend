import { AttributeType, OrderChannel, OrderPaymentStatus, OrderStatus, OrderType, ValueType } from "./types"

export const attributeTypesMap: Record<AttributeType, string> = {
  "dropdown": 'Lista desplegable',
  "color": 'Color',
  "short-text": 'Texto corto',
  "long-text": 'Texto largo',
  'font': "Tipografía"
}

export const discountTypesMap = {
  "percentage": 'Porcentaje',
  "fixed": 'Monto fijo',
}

export const discountLimitByMap = {
  "collection": 'Colección',
  "product": 'Producto',
}

export const slideTypeMap = {
  "collection": 'Colección',
  "product": 'Producto',
}

export const userRolesMap = {
  "admin": "Administrador",
  "user": "Usuario",
  "customer": "Cliente",
  "delivery": "Repartidor"
}

export const valueTypesMap: Record<ValueType, string> = {
  "option": "Opción",
  "color": "Color"
}

export const orderTypeMap: Record<OrderType, string> = {
  'manual': "Manual",
  "online-store": "Tienda"
}

export const orderPaymentMethodMap = {
  'paypal': "PayPal",
  'stripe': "Stripe",
  'transfer': "Transferencia o depósito"
}

export const orderShippingTypeMap = {
  'local': 'Local',
  'express': 'Express',
  'pickUp': 'Recoge en tienda'
}

export const orderStatusColorMap: Record<OrderStatus, string> = {
  "Nuevo": 'blue',
  'En ruta': 'yellow',
  'Cancelado': 'red',
  'Entregado': 'green',
  "En progreso": 'yellow',
  "Listo para recoger": 'green'
};

export const orderTypeColorMap: Record<OrderType, string> = {
  "online-store": 'green',
  'manual': 'blue',
};

export const orderPaymentStatusColorMap: Record<OrderPaymentStatus, string> = {
  "Pagado": 'green',
  'Anticipo': 'red',
};

export const orderChannelMap: Record<OrderChannel, string> = {
  "instagram": 'Instagram',
  'facebook': 'Facebook',
  'whatsApp': 'WhatsApp',
};

export const pagePermissionsMap: Record<string, string[]> = {
  '/admin/orders': ['view'],
  '/admin/tablero': ['view'],
  '/admin/products': ['view'],
  '/admin/attributes': ['view'],
  '/admin/values': ['view'],
  '/admin/collections': ['view'],
  '/admin/customers': ['view'],
  '/admin/users': ['view'],
  '/admin/discounts': ['view'],
  '/admin/slides': ['view'],
  '/admin/disabled-days': ['view'],
  '/admin/external-sales': ['view'],


  '/admin/reports/rutas': ['view'],
  '/admin/reports/repartidores': ['view'],
  '/admin/reports/ventas-por-usuario': ['view'],
  '/admin/reports/ventas': ['view'],
  '/admin/reports/pedidos': ['view'],
};

export const pageTitleMap = {
  '/admin/orders': 'Pedidos',
  '/admin/products': 'Productos',
  '/admin/attributes': 'Atributos',
  '/admin/values': 'Valores',
  '/admin/collections': 'Colecciones',
  '/admin/customers': 'Clientes',
  '/admin/users': 'Usuarios',
  '/admin/discounts': 'Descuentos',
}

export const pageResourceMap = {
  '/admin/orders': "/api/admin/orders",
  '/admin/attributes': "/api/admin/attributes",
  '/admin/values': "/api/admin/values",
  '/admin/products': "/api/admin/products",
  '/admin/collections': "/api/admin/collections",
  '/admin/customers': "/api/admin/users",
  '/admin/users': "/api/admin/users",
  '/admin/discounts': "/api/admin/discounts",
  '/admin/slides': "/api/admin/slides",
  '/admin/disabled-days': "/api/admin/disabled-days",
  '/admin/external-sales': "/api/admin/external-sales",
  '/admin/reports/rutas': "/api/admin/orders",
  '/admin/reports/repartidores': "/api/admin/orders",
  '/admin/reports/ventas-por-usuario': "/api/admin/orders",
  '/admin/reports/ventas': "/api/admin/orders",
  '/admin/reports/pedidos': "/api/admin/orders",
  '/admin/tablero': "/api/admin/orders",
  '/admin/my-orders': "/api/admin/orders"
}

export const permissionLabelMap = {
  'view': 'Puede ver',
  'create': 'Puede crear',
  'edit': 'Puede editar',
  'delete': 'Puede eliminar'
}

export const occasionTypesMap = {
  "birthday": "Cumpleaños",
  "graduation": "Graduación",
  "anniversary": "Aniversario",
  "baby_welcome": "Bienvenida de bebés",
  "amazing_day": "Para un día increíble",
  "lovers": "De enamorados",
  "condolences": "Condolencias",
  "mothers_day": "Día de las madres",
  "fathers_day": "Día del padre",
  "grandparents_day": "Día del abuelo",
  "childrens_day": "Día del niño",
  "happy_holidays": "Happy holidays",
  "new_year": "Año nuevo",
}

export const fontMap: Record<number, string> = {
  1: "Gothic",
  2: "JahannamBalla",
  3: "NovitaSignora",
  4: "AlistairSignature",
  5: "AnovaDemoRegular",
  6: "Cartier",
  7: "BebasRegular",
  8: "PatrickCleo",
  9: "Muggsy",
  10: "Pillish"
};


export const productFieldMap = {
  // a single property called name, with a type and a label

  //common product props
  name: { label: "Nombre del producto", type: "text" },
  code: { label: "Código del producto", type: "text" },
  description: { label: "Descripción", type: "text" },
  keywords: { label: "Palabras clave", type: "text" },
  price: { label: "Precio", type: "text" },
  collections: { label: "Colecciones", type: "list", fields: ["_id", "name"] },
  discount: { label: "Descuento", type: "object" },
  active: { label: "Estado", type: "boolean", true: 'Activo', false: 'No activo' },
  isCustomizable: { label: "Personalizable", type: "boolean", true: 'Sí', false: 'No' },
  attributes: { label: "Atributos", type: "list", fields: ["_id", "shortName"] },
  highlight: { label: "Destacado", type: "boolean", true: 'Sí', false: 'No' },
  inventory: { label: "Inventario", type: "object" },
  images: { label: "Imágenes", type: "list", render: "grid" },
  createdAt: { label: "Creado el", type: "date" },
  updatedAt: { label: "Actualizado el", type: "date" },
  soldOut: { label: "Agotado", type: "boolean", true: 'Sí', false: 'No' },
  specs: { label: "Especificaciones", type: "text" },


  //store specific props
  minDays: { label: "Días mínimos de entrega", type: "text" },
};

export const collectionFieldsMap = {

  name: {

  },
  code: {

  },
  description: {

  },
  image: {

  },
  active: {

  },
  keywords: {

  },
  parentCollection: {

  },

  //nice to have
  //products: {}
}

export const orderFielsdMap = {

  //order base props
  number: { label: "Número de pedido", type: "text" },
  name: { label: "Nombre de cliente", type: "text" },
  email: { label: "Correo electrónico", type: "text" },
  phone: { label: "Teléfono de contacto", type: "text" },
  status: { label: "Estado", type: "text" },
  shippingAddress: { label: "Dirección de envío", type: "text" },
  shippingFee: { label: "Costo de envío", type: "text" },
  total: { label: "Total", type: "text" },
  subTotal: { label: "Subtotal", type: "text" },
  products: { label: "Productos", type: "text" },
  type: { label: "Tipo de pedido", type: "text" },
  paymentMethod: { label: "Método de pago", type: "text" },
  paymentStatus: { label: "Estado del pago", type: "text" },
  createdBy: { label: "Creado por", type: "text" },
  createdAt: { label: "Creado el", type: "text" },
  updatedAt: { label: "Actualizado el", type: "text" },
  history: { label: "Historial", type: "text" },

  //store specific 
  shippingType: { label: "Tipo de envío", type: "text" },
  receiverName: { label: "Quien recibe", type: "text" },
  receiverPhone: { label: "Telefono de quien recibe", type: "text" },
  anonymous: { label: "Anónimo", type: "text" },
  deliveryDate: { label: "Fecha de entrega", type: "text" },
  dedicationCardMessage: { label: "Mensaje de dedicatoria", type: "text" },
  channel: { label: "Canal", type: "text" },
  anticipo: { label: "Anticipo", type: "text" },
  remaining: { label: "Restante", type: "text" },
  image: { label: "Imagen de referencia", type: "text" },
}