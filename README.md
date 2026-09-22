# ☕ Brew & Bean — Coffee Ordering Website

A small coffee-ordering web app built with React + Vite. Customers place an
order through a form; the order is saved to a Supabase database and a
notification email is sent to the shop owner via EmailJS.

**Assignment feature:** Email Notification (EmailJS) — email yourself a
confirmation when an order is created.

## Flow

```
Customer fills the order form
        ↓
React validates the input
        ↓
Supabase  →  order saved in the `orders` table
        ↓
EmailJS   →  notification email sent
        ↓
Owner receives the order in their inbox
```

## Tech stack

| Layer            | Tool                          |
| ---------------- | ----------------------------- |
| UI               | React 19 + Vite               |
| Styling          | Tailwind CSS v4               |
| Icons            | react-icons                   |
| Database         | Supabase (PostgreSQL)         |
| Email            | EmailJS                       |
| Hosting          | Vercel                        |

There is no custom backend server. Supabase and EmailJS are both called
directly from the browser.

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx        Header with navigation links
│   ├── Hero.jsx          Headline / call-to-action section
│   ├── CoffeeMenu.jsx    Product cards
│   ├── OrderForm.jsx     The order form: state, validation, submission
│   └── Footer.jsx        Footer
├── data/
│   └── coffees.js        The coffee list (shared by menu + form dropdown)
├── lib/
│   ├── supabase.js       Supabase client setup
│   └── emailjs.js        EmailJS sending helper
├── App.jsx               Assembles the page
├── main.jsx              Entry point
└── index.css             Tailwind import
```

## Running locally

```bash
npm install
```

Copy `.env.example` to `.env.local` and fill in your own values:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

Then:

```bash
npm run dev
```

> `.env.local` is gitignored and is never committed. Vite only reads env files
> at startup, so restart the dev server after changing one.

## Database

The `orders` table:

| Column           | Type          | Notes                          |
| ---------------- | ------------- | ------------------------------ |
| `id`             | `uuid`        | Primary key, generated in React |
| `customer_name`  | `text`        | Required                       |
| `customer_email` | `text`        | Required                       |
| `phone`          | `text`        | Optional                       |
| `product`        | `text`        | Required                       |
| `quantity`       | `integer`     | Required, must be >= 1         |
| `unit_price`     | `integer`     | Price per cup at order time    |
| `total_amount`   | `integer`     | Generated: `unit_price * quantity` |
| `instructions`   | `text`        | Optional                       |
| `created_at`     | `timestamptz` | Defaults to `now()`            |

Row Level Security is enabled with a single policy allowing the anonymous role
to `INSERT`. There is deliberately **no** public `SELECT`, `UPDATE` or `DELETE`
policy, so the public can submit orders but cannot read, edit or delete them.

## Security notes

- Only public/publishable keys are used in the frontend. Anything prefixed
  `VITE_` is bundled into the JavaScript that ships to the browser.
- The Supabase `service_role` key and the EmailJS *private* key are never used
  in this project.
- Data protection is enforced by Supabase Row Level Security, not by the
  frontend code.
