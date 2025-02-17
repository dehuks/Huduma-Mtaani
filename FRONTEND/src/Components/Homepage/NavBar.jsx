import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setSignUpModalOpen] = useState(false);

  // Function to switch from Login to SignUp
  const openSignUp = () => {
    setLoginModalOpen(false);
    setSignUpModalOpen(true);
  };

  // Function to switch from SignUp to Login
  const openLogin = () => {
    setSignUpModalOpen(false);
    setLoginModalOpen(true);
  };

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
            <button
              className="bg-Placeholder px-3 py-1 rounded-xl"
              onClick={() => setLoginModalOpen(true)}
            >
              Join Us
            </button>
          </ul>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 z-50 right-4 bg-CTA-card rounded-lg p-4 shadow-lg w-48">
          <ul className="flex flex-col gap-4 text-white">
            <li>Home</li>
            <li>Services</li>
            <li>Contact</li>
            <button
              className="bg-Placeholder px-3 py-1 rounded-xl"
              onClick={() => {
                setSignUpModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
            >
              Join Us
            </button>
          </ul>
        </div>
      )}

      {/* Login & SignUp Modals */}
      <Login isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} onSignUpClick={openSignUp} />
      <SignUp isOpen={isSignUpModalOpen} onClose={() => setSignUpModalOpen(false)} onLoginClick={openLogin} />
    </div>
  );
};

export default NavBar;
