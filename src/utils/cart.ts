import { Cart } from "@/interfaces";

const renderSubtotal = (cart: Cart) => {
  function add(accumulator: number, a: number) {
    return accumulator + a;
  }

  let sum = cart.items?.map(product => product.hasDiscount ? product.price - product.discountValue : product.price).reduce(add, 0);

  return sum
}

const renderTotal = (cart: Cart, shippingFee: number) => {
  const sum = renderSubtotal(cart)

  let finalPrice

  if (cart.discount) {
    if (cart.discount.type?.value === 'percentage') {
      finalPrice = (sum - (sum * (cart.discount?.value / 100)))
    } else {
      finalPrice = (sum - cart.discount?.value)
    }
  } else {
    finalPrice = sum
  }

  let total = finalPrice + shippingFee

  let original = finalPrice + shippingFee

  let discounted

  return { total, discounted, original }

}

const renderTotalWithProductDiscounts = (cart: Cart, shippingFee: number) => {
  const sum = renderSubtotal(cart)

  let finalPrice

  finalPrice = sum

  let total = finalPrice + shippingFee

  let original = finalPrice + shippingFee

  let discounted

  return { total, discounted, original }
}

export {
  renderSubtotal,
  renderTotal,
  renderTotalWithProductDiscounts
}