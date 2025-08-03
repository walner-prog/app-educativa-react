import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Quiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === parseInt(quizId));

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Si el quiz no existe, redirigir a la página de inicio
    if (!quiz) {
      navigate('/');
    }
  }, [quiz, navigate]);

  const handleAnswer = (option) => {
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setScore(score + 1);
    }

    // Esperar un poco antes de pasar a la siguiente pregunta
    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Al final del quiz, guardar el score en localStorage y mostrar el resultado
        localStorage.setItem(`score_quiz_${quizId}`, score + (isCorrect ? 1 : 0));
        setShowResult(true);
      }
    }, 1000);
  };

  if (!quiz) return null; // No renderizar si no se encuentra el quiz

  const currentQuestion = quiz.questions[currentQuestionIndex];

  if (showResult) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-green-600 mb-4">¡Terminaste!</h2>
        <p className="text-2xl text-gray-700 mb-6">Obtuviste {score} de {quiz.questions.length} preguntas correctas.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">{quiz.title}</h2>
        <span className="text-xl font-bold text-gray-600">Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}</span>
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