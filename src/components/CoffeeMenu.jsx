import { coffees } from "../data/coffees";

function CoffeeMenu() {
  return (
    <section id="menu" className="bg-amber-50 px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold text-amber-950">
          Our Coffee
        </h2>
        <p className="mt-2 text-center text-amber-900/70">
          Five classics, made properly.
        </p>

        {/* Grid: 1 column on mobile, 2 on tablets, 3 on desktop */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coffees.map((coffee) => (
            <article
              key={coffee.name}
              className="rounded-2xl border border-amber-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-4xl">{coffee.emoji}</div>
              <h3 className="mt-3 text-xl font-semibold text-amber-950">
                {coffee.name}
              </h3>
              <p className="mt-2 text-sm text-amber-900/70">
                {coffee.description}
              </p>
              <p className="mt-4 font-bold text-amber-700">₹{coffee.price}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoffeeMenu;
