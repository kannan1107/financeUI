import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOG.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "New Customer", path: "/customer" },
    { name: "EMI Paying", path: "/emi" },
    { name: "Loan Status", path: "/loan" },
    { name: "Customer Update", path: "/update" },
    { name: "Foreclosure", path: "/close" },
    { name: "List Out", path: "/list" },
  ];

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

        <div className="flex items-center space-x-4">
          <Link to="/" className={navLinkClass}>Home</Link>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-2xl leading-none text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              title="Menu"
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
            >
              &hellip;
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 z-50 mt-3 w-52 overflow-hidden rounded-md border border-emerald-100 bg-white shadow-xl">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

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
      </div>
    </nav>
  );
};

export default Navbar;
