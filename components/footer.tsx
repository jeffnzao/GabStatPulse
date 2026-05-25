"use client";

import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="bg-dark-900/80 backdrop-blur-lg border-t border-dark-700/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-bold text-lg mb-4 gradient-text">GabStat Pulse</h3>
            <p className="text-gray-400 text-sm">
              Comprendre les réalités du Gabon grâce aux données citoyennes
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-primary-500 transition">Accueil</a></li>
              <li><a href="/surveys" className="hover:text-primary-500 transition">Sondages</a></li>
              <li><a href="/dashboard" className="hover:text-primary-500 transition">Tableau de Bord</a></li>
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary-500 transition">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Contact</a></li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-primary-500 transition">Conditions</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary-500 transition">Cookies</a></li>
            </ul>
          </motion.div>
        </div>

        <div className="border-t border-dark-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; 2026 GabStat Pulse. Tous droits réservés.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
