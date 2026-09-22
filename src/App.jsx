import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CoffeeMenu from "./components/CoffeeMenu";
import OrderForm from "./components/OrderForm";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen bg-amber-50 font-sans">
      <Navbar />
      <main>
        <Hero />
        <CoffeeMenu />
        <OrderForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
