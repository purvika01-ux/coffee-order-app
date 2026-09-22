import { FaCoffee } from "react-icons/fa";

function Hero() {
  return (
    <section
      id="home"
      className="bg-gradient-to-b from-amber-100 to-amber-50 px-4 py-16 sm:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:justify-between">
        {/* Left side: text */}
        <div className="max-w-xl text-center md:text-left">
          <p className="mb-3 text-sm font-semibold tracking-widest text-amber-700 uppercase">
            Freshly roasted, every morning
          </p>
          <h1 className="text-4xl leading-tight font-bold text-amber-950 sm:text-5xl">
            Good coffee,
            <br />
            ordered in seconds.
          </h1>
          <p className="mt-4 text-base text-amber-900/80 sm:text-lg">
            Pick your favourite brew, tell us how you like it, and place your
            order. We&apos;ll have it ready and waiting.
          </p>
          <a
            href="#order"
            className="mt-8 inline-block rounded-full bg-amber-950 px-7 py-3 font-semibold text-amber-50 transition hover:bg-amber-800"
          >
            Place an Order
          </a>
        </div>

        {/* Right side: a simple decorative circle with a coffee icon */}
        <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-full bg-amber-950 shadow-xl sm:h-72 sm:w-72">
          <FaCoffee className="text-7xl text-amber-400 sm:text-8xl" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
