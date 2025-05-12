import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { PiIcon as TaxiIcon, LogOut, Menu, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado para manejar la visibilidad del menú en móvil

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TaxiIcon size={28} className="text-blue-600 mr-2" />
            <h1 className="text-xl font-semibold text-gray-800">Sistema de Reservas - Admin</h1>
          </div>

          {/* Menú en pantallas grandes */}
          <div className="hidden lg:flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bienvenido, <span className="font-medium">{user?.username}</span>
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center text-sm px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-1" />
              Cerrar sesión
            </motion.button>
          </div>

          {/* Menú hamburguesa en pantallas pequeñas */}
          <div className="lg:hidden flex items-center">
            <motion.button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-gray-800"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? (
                <X size={24} className="text-gray-600" />
              ) : (
                <Menu size={24} className="text-gray-600" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Menú desplegable para dispositivos móviles */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 space-y-2">
            <div className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              Bienvenido, <span className="font-medium">{user?.username}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={16} className="mr-2" />
              Cerrar sesión
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
