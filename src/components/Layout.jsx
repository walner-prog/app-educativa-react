import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaGraduationCap, FaGlobe } from 'react-icons/fa';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { LanguageContext } from '../components/LanguageContext';

const Layout = ({ children }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  // Textos según idioma
  const texts = {
    rewards: language === 'es' ? 'Mis Recompensas' : 'My Rewards',
    signIn: language === 'es' ? 'Iniciar sesión' : 'Sign In',
    copyright:
      language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <header className="fixed top-0 left-0 w-full bg-blue-500 dark:bg-gray-800 text-white p-4 shadow-lg flex flex-wrap justify-between items-center gap-2 z-50 transition-colors duration-300">
        <Link to="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <FaGraduationCap className="text-yellow-400 text-4xl sm:text-5xl" />
          <span className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-300 to-yellow-400">
            Skill<span className="text-yellow-500">Up</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <button
            onClick={toggleLanguage}
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-yellow-400 p-2 rounded-full hover:scale-105 transition-transform duration-300"
            title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
          >
            <FaGlobe />
          </button>

          <Link
            to="/rewards"
            className="bg-yellow-400 text-gray-800 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full flex items-center hover:bg-yellow-300 transition-colors text-sm sm:text-base"
          >
            <FaTrophy className="mr-1 sm:mr-2" /> {texts.rewards}
          </Link>

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
