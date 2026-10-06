// Scratch space. `npm run play` re-runs this file every time you save.
// Hover over things in your editor to see what TypeScript infers.

type CartItem = { name: string; price: number; quantity: number };

const cart: CartItem[] = [
  { name: "Coffee beans", price: 14.5, quantity: 2 },
  { name: "Filter papers", price: 3.99, quantity: 1 },
];

const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
console.log(`Cart total: $${total.toFixed(2)}`);
