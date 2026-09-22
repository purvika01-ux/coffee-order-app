import { useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";
import { coffees } from "../data/coffees";
import { supabase } from "../lib/supabase";
import { sendOrderEmail } from "../lib/emailjs";

function OrderForm() {
  // 1) One piece of state holding EVERY field in the form.
  //    The keys here match the `name` attribute of each input below.
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    product: "",
    quantity: 1,
    instructions: "",
  });

  // 2) State for validation errors. Example: { customerName: "Name is required" }
  const [errors, setErrors] = useState({});

  // 3) State for the success message shown after a valid submit.
  const [successMessage, setSuccessMessage] = useState("");

  // 4) State for an error message if the database insert fails.
  const [errorMessage, setErrorMessage] = useState("");

  // 4b) State for a WARNING: the order saved, but the email did not send.
  //     Kept separate from errorMessage so we never tell the customer the
  //     whole order failed when it actually succeeded.
  const [warningMessage, setWarningMessage] = useState("");

  // 5) True while we are waiting for Supabase to respond.
  //    Used to disable the button and show "Placing order...".
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Runs every time the user types in / changes any field.
  function handleChange(event) {
    const { name, value } = event.target;

    // Copy the old state (...formData) and overwrite just the one field.
    setFormData((previous) => ({ ...previous, [name]: value }));

    // Clear that field's error as soon as the user starts fixing it.
    setErrors((previous) => ({ ...previous, [name]: "" }));

    // Hide old banners once the user edits the form again.
    setSuccessMessage("");
    setErrorMessage("");
    setWarningMessage("");
  }

  // Checks the values and returns an object of error messages.
  // An empty object means "everything is valid".
  function validateForm() {
    const newErrors = {};

    if (formData.customerName.trim() === "") {
      newErrors.customerName = "Name is required";
    }

    if (formData.customerEmail.trim() === "") {
      newErrors.customerEmail = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.customerEmail.trim())) {
      newErrors.customerEmail = "Please enter a valid email address";
    }

    if (formData.product === "") {
      newErrors.product = "Please select a coffee";
    }

    if (Number(formData.quantity) < 1 || Number.isNaN(Number(formData.quantity))) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    return newErrors;
  }

  // Runs when the user clicks "Place Order".
  // `async` because talking to Supabase takes time and returns a Promise.
  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page

    const newErrors = validateForm();
    setErrors(newErrors);

    // If there is at least one error, stop here.
    if (Object.keys(newErrors).length > 0) {
      setSuccessMessage("");
      setErrorMessage("");
      setWarningMessage("");
      return;
    }

    // Guard against a double-click firing two orders.
    if (isSubmitting) return;

    // THE ORDER OBJECT, in database shape (snake_case column names).
    // We generate the id ourselves instead of letting the database do it.
    // Why? Our security rules allow INSERT but not SELECT, so the database
    // will not hand the new row back to us — yet the email needs the order id.
    // Making the id here means we already know it. crypto.randomUUID() is
    // built into every modern browser and produces a unique id every time.
    const order = {
      id: crypto.randomUUID(),
      customer_name: formData.customerName.trim(),
      customer_email: formData.customerEmail.trim(),
      phone: formData.phone.trim(),
      product: formData.product,
      quantity: Number(formData.quantity),
      instructions: formData.instructions.trim(),
    };

    console.log("Order placed:", order);

    // Turn on the loading state and clear old banners.
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");
    setWarningMessage("");

    // ── STEP 1: save the order in Supabase ────────────────────────────────
    // We do NOT call .select() here, for the reason explained above.
    const { error: supabaseError } = await supabase.from("orders").insert(order);

    // CASE 1 — the database failed. Stop completely.
    // Do NOT send an email about an order that was never saved.
    if (supabaseError) {
      console.error("Supabase insert failed:", supabaseError);
      setIsSubmitting(false);
      setErrorMessage("Order could not be created. Please try again.");
      return; // <- the email code below never runs
    }

    console.log("Saved to Supabase:", order.id);

    // ── STEP 2: the order IS saved. Now email the confirmation. ───────────
    // Handled separately, because a failed email must never make the customer
    // think the order was lost — it is already safely in the database.
    try {
      await sendOrderEmail(order);
      console.log("Confirmation email sent.");
      // CASE 3 — everything worked.
      setSuccessMessage("Order placed successfully!");
    } catch (emailError) {
      // CASE 2 — order saved, email failed.
      console.error("EmailJS send failed:", emailError);
      setWarningMessage(
        "Order was created, but the confirmation email could not be sent."
      );
    }

    setIsSubmitting(false);

    // Reset the form back to empty.
    setFormData({
      customerName: "",
      customerEmail: "",
      phone: "",
      product: "",
      quantity: 1,
      instructions: "",
    });
  }

  // Shared CSS classes so every input looks the same.
  const inputClasses =
    "w-full rounded-lg border border-amber-300 bg-white px-4 py-2.5 text-amber-950 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200";
  const labelClasses = "mb-1.5 block text-sm font-medium text-amber-950";
  const errorClasses = "mt-1 text-sm text-red-600";

  return (
    <section id="order" className="bg-amber-100 px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-3xl font-bold text-amber-950">
          Place Your Order
        </h2>
        <p className="mt-2 text-center text-amber-900/70">
          Fill in your details and we&apos;ll start brewing.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 space-y-5 rounded-2xl bg-white p-6 shadow-lg sm:p-8"
        >
          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className={labelClasses}>
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Rahul Sharma"
              className={inputClasses}
            />
            {errors.customerName && (
              <p className={errorClasses}>{errors.customerName}</p>
            )}
          </div>

          {/* Customer Email */}
          <div>
            <label htmlFor="customerEmail" className={labelClasses}>
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              placeholder="rahul@gmail.com"
              className={inputClasses}
            />
            {errors.customerEmail && (
              <p className={errorClasses}>{errors.customerEmail}</p>
            )}
          </div>

          {/* Product + Quantity side by side on wider screens */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="product" className={labelClasses}>
                Coffee <span className="text-red-600">*</span>
              </label>
              <select
                id="product"
                name="product"
                value={formData.product}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">-- Select a coffee --</option>
                {coffees.map((coffee) => (
                  <option key={coffee.name} value={coffee.name}>
                    {coffee.name} (₹{coffee.price})
                  </option>
                ))}
              </select>
              {errors.product && <p className={errorClasses}>{errors.product}</p>}
            </div>

            <div>
              <label htmlFor="quantity" className={labelClasses}>
                Quantity <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                className={inputClasses}
              />
              {errors.quantity && (
                <p className={errorClasses}>{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Phone (optional) */}
          <div>
            <label htmlFor="phone" className={labelClasses}>
              Phone Number{" "}
              <span className="text-amber-900/50">(optional)</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              className={inputClasses}
            />
          </div>

          {/* Special Instructions (optional) */}
          <div>
            <label htmlFor="instructions" className={labelClasses}>
              Special Instructions{" "}
              <span className="text-amber-900/50">(optional)</span>
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows="3"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Less sugar, extra hot..."
              className={inputClasses}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-950 px-6 py-3 font-semibold text-amber-50 transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:bg-amber-950/50"
          >
            {isSubmitting && <FaSpinner className="animate-spin" />}
            {isSubmitting ? "Processing Order..." : "Place Order"}
          </button>

          {/* Success message: only rendered when successMessage is not empty */}
          {successMessage && (
            <p className="flex items-center justify-center gap-2 rounded-lg bg-green-100 px-4 py-3 font-medium text-green-800">
              <FaCheckCircle />
              {successMessage}
            </p>
          )}

          {/* Warning: the order saved, but the email did not go out. */}
          {warningMessage && (
            <p className="flex items-center justify-center gap-2 rounded-lg bg-yellow-100 px-4 py-3 text-center font-medium text-yellow-900">
              <FaExclamationTriangle className="shrink-0" />
              {warningMessage}
            </p>
          )}

          {/* Error message: only rendered when errorMessage is not empty */}
          {errorMessage && (
            <p className="flex items-center justify-center gap-2 rounded-lg bg-red-100 px-4 py-3 font-medium text-red-800">
              <FaExclamationCircle />
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default OrderForm;
