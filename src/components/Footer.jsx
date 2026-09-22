import { FaMugHot } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-amber-950 px-4 py-8 text-amber-100">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm sm:flex-row">
        <p className="flex items-center gap-2 font-semibold">
          <FaMugHot className="text-amber-400" />
          Brew &amp; Bean
        </p>
        <p className="text-amber-100/70">
          © {new Date().getFullYear()} Brew &amp; Bean. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
