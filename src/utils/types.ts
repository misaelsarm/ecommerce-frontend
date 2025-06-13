//order
export type PaymentMethod = 'paypal' | 'stripe' | 'transfer';
export type OrderType = 'manual' | 'online-store';
export type ShippingType = 'express' | 'local' | 'pickUp'
export type OrderStatus = 'Nuevo' | 'En progreso' | 'En ruta' | 'Cancelado' | 'Entregado' | 'Listo para recoger';
export type OrderChannel = 'instagram' | 'facebook' | 'whatsApp'
export type OrderPaymentStatus = 'Pagado' | 'Anticipo'

//attribute
export type AttributeType = "dropdown" | "color" | "short-text" | "long-text" | 'font';

//discount
export type DiscountType = 'fixed' | 'percentage';
export type LimitBy = 'collection' | 'product';

//slide
export type SlideType = 'collection' | 'product'

//user
export type UserRole = 'admin' | 'customer' | 'user' | 'delivery'


