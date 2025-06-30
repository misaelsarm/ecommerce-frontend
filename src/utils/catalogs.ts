import { OrderStatus } from "./types"

export const orderShippingTypes = [
  {
    label: 'Local',
    value: 'local'
  },
  {
    label: 'Express',
    value: 'express'
  },
  {
    label: 'Recoge en tienda',
    value: 'pickUp'
  },
]

export const orderTypes = [
  {
    label: 'Manual',
    value: 'manual'
  },
  {
    label: 'Tienda',
    value: 'online-store'
  },
]

export const orderChannels = [
  {
    label: "Instagram",
    value: "instagram"
  },
  {
    label: "Facebook",
    value: "facebook"
  },
  {
    label: "WhatsApp",
    value: "whatsApp"
  },
]

export const orderPaymentMethods = [

  {
    label: "PayPal",
    value: 'paypal',
  },
  {
    label: "Stripe",
    value: 'stripe',
  },
  {
    label: "Transferencia o depósito",
    value: 'transfer'
  },
]

export const orderPaymentStates = [

  {
    label: "Pagado",
    value: 'Pagado',
  },
  {
    label: "Anticipo",
    value: 'Anticipo',
  },
]

export const userRoles = [
  {
    label: 'Administrador',
    value: 'admin'
  },
  {
    label: 'Usuario',
    value: 'user'
  },
  {
    label: 'Repartidor',
    value: 'delivery'
  },
]

export const valueTypes = [
  {
    label: 'Opción',
    value: 'option'
  },
  {
    label: 'Color',
    value: 'color'
  },
]

export const orderStatusCatalog: OrderStatus[] = ['Nuevo', 'En ruta', 'En progreso', 'Cancelado', 'Listo para recoger', 'Entregado']