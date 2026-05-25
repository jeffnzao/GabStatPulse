"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">
              GabStat Pulse
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-300 hover:text-primary-500 transition">
              Accueil
            </Link>
            <Link href="/surveys" className="text-gray-300 hover:text-primary-500 transition">
              Sondages
            </Link>
            <Link href="/dashboard" className="text-gray-300 hover:text-primary-500 transition">
              Tableau de Bord
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="primary">S'inscrire</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            <Link href="/" className="block px-4 py-2 text-gray-300 hover:bg-dark-800 rounded">
              Accueil
            </Link>
            <Link href="/surveys" className="block px-4 py-2 text-gray-300 hover:bg-dark-800 rounded">
              Sondages
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-dark-800 rounded">
              Tableau de Bord
            </Link>
            <div className="flex gap-2 px-4 py-2">
              <Link href="/auth/signin" className="flex-1">
                <Button variant="ghost" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/signup" className="flex-1">
                <Button variant="primary" className="w-full">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
