import { FaMugHot } from "react-icons/fa";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-amber-950 text-amber-50 shadow-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 text-xl font-bold">
          <FaMugHot className="text-amber-400" />
          <span>Brew &amp; Bean</span>
        </a>

        {/* Links: hidden on very small screens, shown from `sm` upwards */}
        <ul className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <li>
            <a href="#home" className="hover:text-amber-400">
              Home
            </a>
          </li>
          <li>
            <a href="#menu" className="hover:text-amber-400">
              Menu
            </a>
          </li>
          <li>
            <a href="#order" className="hover:text-amber-400">
              Order
            </a>
          </li>
        </ul>

        {/* Call-to-action button */}
        <a
          href="#order"
          className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-amber-950 transition hover:bg-amber-400"
        >
          Order Now
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
