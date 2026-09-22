// One shared list of coffees, used by BOTH the menu section and the order form.
// Keeping it in one place means the dropdown can never go out of sync with the menu.
export const coffees = [
  {
    name: "Cappuccino",
    price: 149,
    emoji: "☕",
    description: "Equal parts espresso, steamed milk and a thick milk foam cap.",
  },
  {
    name: "Latte",
    price: 169,
    emoji: "🥛",
    description: "Smooth espresso with lots of steamed milk and a light foam.",
  },
  {
    name: "Americano",
    price: 129,
    emoji: "🫖",
    description: "Espresso lengthened with hot water. Strong, black, simple.",
  },
  {
    name: "Mocha",
    price: 189,
    emoji: "🍫",
    description: "Espresso and steamed milk with rich dark chocolate.",
  },
  {
    name: "Cold Coffee",
    price: 159,
    emoji: "🧊",
    description: "Chilled coffee blended with milk and ice. Our summer best-seller.",
  },
];
