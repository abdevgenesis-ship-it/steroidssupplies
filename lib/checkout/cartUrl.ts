type CartLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export function buildCheckoutHref(items: CartLine[]) {
  if (items.length === 0) {
    return "/checkout";
  }

  return `/checkout?cart=${encodeURIComponent(
    JSON.stringify(
      items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    ),
  )}`;
}
