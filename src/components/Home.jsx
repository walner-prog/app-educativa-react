import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy } from 'react-icons/fa';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 text-center shadow-lg flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold">Aprendiendo Juntos</Link>
        <Link to="/rewards" className="bg-yellow-400 text-gray-800 font-bold py-2 px-4 rounded-full flex items-center hover:bg-yellow-300 transition-colors">
          <FaTrophy className="mr-2" /> Mis Recompensas
        </Link>
      </header>
      <main className="flex-grow w-full p-4 flex flex-col items-center justify-center">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 App Educativa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;