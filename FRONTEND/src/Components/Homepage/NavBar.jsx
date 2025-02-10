import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex justify-center">
        <div className="bg-CTA-card w-[800px] flex justify-between items-center mt-5 mx-20 rounded-xl px-4 py-3">
          {/* Brand Name */}
          <p className="text-white md:text-3xl text-2xl font-medium">Huduma Mtaani</p>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center md:gap-12 gap-4 text-white">
            <li>Home</li>
            <li>Services</li>
            <li>Contact</li>
            <button className="bg-Placeholder px-3 py-1 rounded-xl">Join Us</button>
          </ul>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 z-99 right-4 bg-CTA-card rounded-lg p-4 shadow-lg w-48">
          <ul className="flex flex-col gap-4 text-white">
            <li>Home</li>
            <li>Services</li>
            <li>Contact</li>
            <button className="bg-Placeholder px-3 py-1 rounded-xl">Join Us</button>
          </ul>
        </div>
      )}
    </div>
  );
};

export default NavBar;
