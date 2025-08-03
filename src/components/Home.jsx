import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  const [quizScores, setQuizScores] = useState({});
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    // Leer los puntajes guardados
    const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    setQuizScores(scores);
    const global = parseInt(localStorage.getItem('globalScore') || '0', 10);
    setGlobalScore(global);
  }, []);

  return (
    <div className="text-center w-full max-w-4xl">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4 animate-bounce">
        <FaGraduationCap className="inline-block mr-4 text-6xl" />¡Hola! ¿Qué quieres aprender hoy?
      </h1>
      <p className="text-2xl font-bold text-gray-700 mb-4">Puntaje Global: <span className="text-blue-500">{globalScore}</span> puntos</p>
      <p className="text-xl text-gray-700 mb-8">Elige una de las actividades para empezar y gana puntos.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quiz/${quiz.id}`}
            className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 relative"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
            <p className="text-gray-600">{quiz.description}</p>
            {quizScores[quiz.id] && (
              <span className="absolute top-2 right-2 bg-green-500 text-white font-bold text-xs px-2 py-1 rounded-full">
                Puntaje: {quizScores[quiz.id]}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;