import React from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isSignedIn } = useUser();

  if (isSignedIn === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🔒 Acceso restringido
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas iniciar sesión para acceder a esta página.
          </p>
          <Link
            to="/sign-in"
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
