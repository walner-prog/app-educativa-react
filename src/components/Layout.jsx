import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrophy, FaDollarSign } from 'react-icons/fa';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4 shadow-lg flex flex-wrap justify-between items-center gap-2">
        {/* Logo */}
        <Link to="/" className="text-2xl sm:text-3xl font-bold">
          Aprendiendo Juntos
        </Link>

        {/* Botones */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <Link
            to="/rewards"
            className="bg-yellow-400 text-gray-800 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-full flex items-center hover:bg-yellow-300 transition-colors text-sm sm:text-base"
          >
            <FaTrophy className="mr-1 sm:mr-2" /> Mis Recompensas
          </Link>

        

          <SignedOut>
            <Link
              to="/sign-in"
              className="bg-white text-blue-600 font-semibold py-1.5 px-3 sm:py-2 sm:px-4 rounded hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Iniciar sesión
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="scale-90 sm:scale-100">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 sm:w-10 sm:h-10" // Tamaño adaptable
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </header>

      <main className="flex-grow w-full p-4 flex flex-col items-center justify-center">
        {children}
      </main>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 App Educativa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Layout;
