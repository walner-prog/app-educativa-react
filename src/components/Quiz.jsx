import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';

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
  const [time, setTime] = useState(30); // Temporizador en segundos
  const [answers, setAnswers] = useState([]); // Para el feedback detallado

  useEffect(() => {
    if (!quiz) {
      navigate('/');
      return;
    }
    const newShuffledQuestions = shuffleArray(quiz.questions);
    setShuffledQuestions(newShuffledQuestions);
    setAnswers(newShuffledQuestions.map(q => ({ ...q, userChoice: null, isCorrect: false })));
  }, [quiz, navigate]);

  useEffect(() => {
    if (time > 0 && !showResult) {
      const timerId = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (time === 0) {
      handleAnswer(null); // Si el tiempo se acaba, se considera respuesta incorrecta
    }
  }, [time, showResult]);

  const saveProgress = (finalScore) => {
    const quizScores = JSON.parse(localStorage.getItem('quizScores') || '{}');
    const globalScore = parseInt(localStorage.getItem('globalScore') || '0', 10);
    const oldScore = quizScores[quizId] || 0;

    if (finalScore > oldScore) {
      quizScores[quizId] = finalScore;
      localStorage.setItem('quizScores', JSON.stringify(quizScores));
      const scoreDifference = finalScore - oldScore;
      const newGlobalScore = globalScore + scoreDifference;
      localStorage.setItem('globalScore', newGlobalScore);
    }
  };

  const handleAnswer = (option) => {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? "correct" : "incorrect");

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex].userChoice = option;
    newAnswers[currentQuestionIndex].isCorrect = isCorrect;
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTime(30); // Reiniciar el temporizador
      } else {
        saveProgress(isCorrect ? score + 1 : score);
        setShowResult(true);
      }
    }, 1000);
  };

  if (!quiz) return null;

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  if (showResult) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-green-600 mb-4">¡Terminaste el Quiz!</h2>
        <p className="text-2xl text-gray-700 mb-6">Obtuviste {score} de {shuffledQuestions.length} preguntas correctas.</p>
        
        <div className="text-left mt-8">
            <h3 className="text-2xl font-bold mb-4">Revisión de Respuestas</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {answers.map((item, index) => (
                    <div key={index} className={`p-4 rounded-lg shadow-sm ${item.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                        <div className="flex items-center space-x-2 mb-2">
                            {item.isCorrect ? (
                                <FaCheckCircle className="text-green-500" />
                            ) : (
                                <FaTimesCircle className="text-red-500" />
                            )}
                            <p className="font-semibold">{item.text}</p>
                        </div>
                        <p className="text-sm">Tu respuesta: <span className="font-medium">{item.userChoice || "No respondiste"}</span></p>
                        {!item.isCorrect && (
                            <p className="text-sm">Correcta: <span className="font-medium text-green-600">{item.correctAnswer}</span></p>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  if (shuffledQuestions.length === 0) {
      return null;
  }

  const progressPercentage = (time / 30) * 100;

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600">{quiz.title}</h2>
        <span className="text-xl font-bold text-gray-600">Pregunta {currentQuestionIndex + 1} de {shuffledQuestions.length}</span>
      </div>

      {/* Barra de progreso del temporizador */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
        <div
          className="bg-red-500 h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="text-center text-red-500 font-bold text-lg mb-4 flex items-center justify-center">
        <FaClock className="mr-2" /> Tiempo restante: {time}s
      </p>

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