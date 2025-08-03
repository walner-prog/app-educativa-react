import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Función para barajar un array de forma aleatoria (Fisher-Yates shuffle)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === parseInt(quizId));

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (!quiz) {
      navigate('/');
      return;
    }
    setShuffledQuestions(shuffleArray(quiz.questions));
  }, [quiz, navigate]);

  const saveProgress = (finalScore) => {
    // 1. Obtener los puntajes actuales de todos los quizzes
    const quizScores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    const globalScore = parseInt(localStorage.getItem('globalScore') || '0', 10);
    
    const oldScore = quizScores[quizId] || 0;

    // 2. Si el puntaje nuevo es mayor, lo actualizamos
    if (finalScore > oldScore) {
      quizScores[quizId] = finalScore;
      localStorage.setItem('quizScores', JSON.stringify(quizScores));
      
      // 3. Sumar la diferencia al puntaje global
      const scoreDifference = finalScore - oldScore;
      const newGlobalScore = globalScore + scoreDifference;
      localStorage.setItem('globalScore', newGlobalScore);
    }
  };

  const handleAnswer = (option) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");

    const newScore = score + (isCorrect ? 1 : 0);
    setScore(newScore);

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Al terminar el quiz, guardamos el progreso
        saveProgress(newScore);
        setShowResult(true);
      }
    }, 1000);
  };

  if (!quiz) return null;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (showResult) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-green-600 mb-4">¡Terminaste!</h2>
        <p className="text-2xl text-gray-700 mb-6">Obtuviste {score} de {shuffledQuestions.length} preguntas correctas.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
      return null;
  }

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">{quiz.title}</h2>
        <span className="text-xl font-bold text-gray-600">Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}</span>
      </div>
      <p className="text-2xl font-semibold text-gray-800 mb-8">{currentQuestion.text}</p>
      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="p-4 border border-gray-300 rounded-lg text-left text-xl font-medium hover:bg-blue-100 transition-colors duration-300 relative"
          >
            {option}
            {feedback === "correct" && option === currentQuestion.correctAnswer && (
              <FaCheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 text-2xl" />
            )}
            {feedback === "incorrect" && option !== currentQuestion.correctAnswer && (
              <FaTimesCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 text-2xl" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Quiz;