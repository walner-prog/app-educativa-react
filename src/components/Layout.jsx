import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaGraduationCap, FaGlobe, FaBolt, FaStore, FaBars, FaTimes } from 'react-icons/fa';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { LanguageContext } from '../components/LanguageContext';

const Layout = ({ children }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);
  const [pendingChallenges, setPendingChallenges] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Cargar desafíos desde localStorage
  useEffect(() => {
    const loadChallenges = () => {
      const saved = localStorage.getItem("challenges");
      if (saved) {
        const parsed = JSON.parse(saved);
        const pending = parsed.filter(c => !c.completed).length;
        setPendingChallenges(pending);
      } else {
        setPendingChallenges(0);
      }
    };

    loadChallenges();
    window.addEventListener("storage", loadChallenges);
    return () => window.removeEventListener("storage", loadChallenges);
  }, []);

  // Textos según idioma
  const texts = {
    rewards: language === 'es' ? 'Mis Recompensas' : 'My Rewards',
    challenges: language === 'es' ? 'Desafíos' : 'Challenges',
    shop: language === 'es' ? 'Tienda' : 'Shop',
    signIn: language === 'es' ? 'Iniciar sesión' : 'Sign In',
    copyright:
      language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="fixed top-0 left-0 w-full bg-blue-500 dark:bg-gray-800 text-white p-4 shadow-lg flex justify-between items-center z-50 transition-colors duration-300">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <FaGraduationCap className="text-yellow-400 text-4xl sm:text-5xl" />
          <span className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-300 to-yellow-400">
            Skill<span className="text-yellow-500">Up</span>
          </span>
        </Link>

        {/* Botón menú en móvil */}
        <button
          className="sm:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Menú en escritorio */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-4 flex-wrap">
          {/* Cambiar idioma */}
          <button
            onClick={toggleLanguage}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-400 p-2 rounded-full hover:scale-105 transition-transform duration-300"
            title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
          >
            <FaGlobe />
          </button>

          {/* Link a Desafíos */}
          <Link
            to="/challenges"
            className="bg-green-400 text-gray-900 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full flex items-center hover:bg-green-300 transition-colors text-sm sm:text-base"
          >
            <FaBolt className="mr-1 sm:mr-2" /> 
            {texts.challenges}
            {pendingChallenges > 0 && (
              <span className="ml-2 bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {pendingChallenges}
              </span>
            )}
          </Link>

          {/* Link a Recompensas */}
          <Link
            to="/rewards"
            className="bg-yellow-400 text-gray-800 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full flex items-center hover:bg-yellow-300 transition-colors text-sm sm:text-base"
          >
            <FaTrophy className="mr-1 sm:mr-2" /> {texts.rewards}
          </Link>

          {/* Link a Tienda */}
          <Link
            to="/shop"
            className="bg-purple-500 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full flex items-center hover:bg-purple-400 transition-colors text-sm sm:text-base"
          >
            <FaStore className="mr-1 sm:mr-2" /> {texts.shop}
          </Link>

          {/* Sesión */}
          <SignedOut>
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-yellow-400 dark:hover:bg-gray-600 transition text-sm sm:text-base"
            >
              {texts.signIn}
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="scale-90 sm:scale-100">
              <UserButton appearance={{ elements: { avatarBox: 'w-8 h-8 sm:w-10 sm:h-10' } }} />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="sm:hidden absolute top-20 left-0 w-full bg-blue-600 dark:bg-gray-800 text-white flex flex-col items-center py-4 gap-3 shadow-md z-40">
          <button
            onClick={toggleLanguage}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-400 p-2 rounded-full"
          >
            <FaGlobe />
          </button>

          <Link to="/challenges" className="flex items-center gap-2 bg-green-400 text-gray-900 px-4 py-2 rounded-full">
            <FaBolt /> {texts.challenges}
            {pendingChallenges > 0 && (
              <span className="ml-2 bg-white text-green-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {pendingChallenges}
              </span>
            )}
          </Link>

          <Link to="/rewards" className="flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full">
            <FaTrophy /> {texts.rewards}
          </Link>

          <Link to="/shop" className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-full">
            <FaStore /> {texts.shop}
          </Link>

          <SignedOut>
            <Link to="/sign-in" className="bg-white text-blue-600 px-4 py-2 rounded">
              {texts.signIn}
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: 'w-10 h-10' } }} />
          </SignedIn>
        </div>
      )}

      <main className="flex-grow w-full p-4 flex flex-col items-center justify-center pt-28 sm:pt-32 transition-colors duration-300">
        {children}
      </main>

      <footer className="bg-gray-800 dark:bg-gray-900 text-white p-4 text-center mt-auto transition-colors duration-300">
        <p>&copy; 2025 App Educativa. {texts.copyright}</p>
      </footer>
    </div>
  );
};

export default Layout;



