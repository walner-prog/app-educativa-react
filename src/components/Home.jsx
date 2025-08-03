import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { FaGraduationCap } from 'react-icons/fa';

const Home = () => {
  const [quizScores, setQuizScores] = useState({});
  const [globalScore, setGlobalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  useEffect(() => {
    // Leer los puntajes guardados
    const scores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    setQuizScores(scores);
    const global = parseInt(localStorage.getItem('globalScore') || '0', 10);
    setGlobalScore(global);
    
    // Calcular el total de preguntas
    const total = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    setTotalQuestions(total);
  }, []);

  const progressPercentage = totalQuestions > 0 ? (globalScore / totalQuestions) * 100 : 0;
  
  const circleStyle = {
    background: `conic-gradient(#3B82F6 ${progressPercentage}%, #E5E7EB ${progressPercentage}%)`,
  };

  return (
    <div className="text-center w-full max-w-4xl">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4 animate-bounce">
        <FaGraduationCap className="inline-block mr-4 text-6xl" />¡Hola! ¿Qué quieres aprender hoy?
      </h1>
      
      {/* Gráfico de progreso circular */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-lg" style={circleStyle}>
          <div className="absolute w-32 h-32 bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl font-extrabold text-blue-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
        <p className="mt-4 text-2xl font-bold text-gray-700">Puntaje Global: <span className="text-blue-500">{globalScore}</span> de {totalQuestions} puntos</p>
      </div>

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