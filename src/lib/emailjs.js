import emailjs from "@emailjs/browser";

// Vite reads `.env.local` and exposes anything starting with VITE_ on import.meta.env.
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

if (!serviceId || !templateId || !publicKey) {
  console.error(
    "Missing EmailJS credentials. Check that .env.local has " +
      "VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID and " +
      "VITE_EMAILJS_PUBLIC_KEY filled in, and that you restarted `npm run dev`."
  );
}

// Optional fields can be empty strings. An email that says "Phone:" with
// nothing after it looks broken, so show a dash instead.
function orDash(value) {
  return value && value.trim() !== "" ? value : "—";
}

/**
 * Sends the "new order" notification email to your own inbox.
 * Returns a Promise. Throws if EmailJS rejects the request.
 */
export function sendOrderEmail(order) {
  // These keys must match the {{variables}} in your EmailJS template exactly.
  const templateParams = {
    order_id: order.id,
    customer_name: order.customer_name,
    customer_email: order.customer_email,
    phone: orDash(order.phone),
    product: order.product,
    quantity: order.quantity,
    unit_price: order.unit_price,
    total_amount: order.total_amount,
    instructions: orDash(order.instructions),
  };

  return emailjs.send(serviceId, templateId, templateParams, { publicKey });
}
