import { AttributeType, OrderChannel, OrderPaymentStatus, OrderStatus, OrderType } from "./types"

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

export const valueTypesMap = {
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

export const statusColorMap: Record<OrderStatus, string> = {
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

export const permissionsMap: Record<string, string[]> = {
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
