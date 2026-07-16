import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOG.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const navLinkClass = "font-medium text-gray-700 transition hover:text-emerald-700";

  return (
    <nav className="border-b border-emerald-100 bg-white px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <img src={logo} alt="Vinayaga Fin" className="h-12 w-auto" />
        </Link>

        <div className="hidden md:flex flex-wrap items-center gap-3">
          <Link to="/" className={navLinkClass}>Home</Link>

          <Link to="/about" className={navLinkClass}>About Us</Link>
          <Link to="/contact" className={navLinkClass}>Contact</Link>
          <Link to="/login" className={navLinkClass}>Login</Link>
          <Link
            to="/register"
            className="rounded-md bg-amber-400 px-3 py-2 font-semibold text-gray-900 transition hover:bg-amber-300"
          >
            Register
          </Link>
          <Link
            to="/"
            className="rounded-md border border-emerald-200 px-3 py-2 font-semibold text-emerald-800 transition hover:bg-emerald-50"
          >
            Logout
          </Link>
        </div>

        <div className="relative md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-2xl leading-none text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            title="Menu"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            •••
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 z-50 mt-3 min-w-[14rem] overflow-hidden rounded-md border border-emerald-100 bg-white shadow-xl">
              <div className="py-2">
                <Link
                  to="/"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-900 bg-amber-100 hover:bg-amber-200 rounded-md mx-3 my-2 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
