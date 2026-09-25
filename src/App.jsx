import { useState } from "react";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CoffeeMenu from "./components/CoffeeMenu";
import OrderForm from "./components/OrderForm";
import Footer from "./components/Footer";
import Revenue from "./revenue";

function App() {
  const [showRevenue, setShowRevenue] = useState(false);

  return (
    <div className="min-h-screen bg-amber-50 font-sans">

      {!showRevenue ? (
        <>
          <Navbar />

          <main>
            <Hero />
            <CoffeeMenu />
            <OrderForm />

            {/* Revenue Dashboard Button */}
            <div className="flex justify-center py-10">
              <button
                onClick={() => setShowRevenue(true)}
                className="rounded-lg bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900"
              >
                View Revenue Dashboard
              </button>
            </div>
          </main>

          <Footer />
        </>
      ) : (
        <>
          <Revenue />

          {/* Back to Coffee Shop */}
          <div className="flex justify-center bg-[#f7f3ee] pb-10">
            <button
              onClick={() => setShowRevenue(false)}
              className="rounded-lg bg-amber-800 px-6 py-3 font-semibold text-white transition hover:bg-amber-900"
            >
              ← Back to Coffee Shop
            </button>
          </div>
        </>
      )}

    </div>
  );
}

export default App;