export type Product = {
  uid: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  gallery: string[];
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
};

export const PRODUCTS: Product[] = [
  {
    uid: "vapor75",
    name: "Vapor75 Keyboard",
    tagline: "Compact 75% keyboard for fast desks and clean builds.",
    description:
      "A compact 75% mechanical keyboard with premium keycaps, smooth switches, and a tuned typing feel.",
    price: 12900,
    currency: "usd",
    image: "/keycap_uv-8.png",
    gallery: ["/keycap_uv-8.png", "/keycap_uv-9.png", "/dreamboard_uv.png"],
    features: [
      "Hot-swap friendly mechanical switch layout",
      "Compact 75% form factor with dedicated function row",
      "Dampened typing feel for a cleaner acoustic profile",
      "Durable keycaps made for everyday gaming and work",
    ],
    specs: [
      { label: "Layout", value: "75%" },
      { label: "Connection", value: "USB-C" },
      { label: "Switches", value: "Mechanical" },
      { label: "Shipping", value: "5-7 business days" },
    ],
  },
];

export function getProductByUid(uid: string) {
  return PRODUCTS.find((product) => product.uid === uid);
}

export function formatProductPrice(product: Product) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
  }).format(product.price / 100);
}
