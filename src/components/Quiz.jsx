import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizzes } from '../data/quizzes';
import { FaCheckCircle, FaTimesCircle, FaClock, FaGem } from 'react-icons/fa';
import { LanguageContext } from '../components/LanguageContext';

// Mezclar preguntas
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const Quiz = () => {
  const { language } = useContext(LanguageContext);
  const { quizId } = useParams();
  const navigate = useNavigate();
  const quiz = quizzes.find((q) => q.id === parseInt(quizId));

  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [time, setTime] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [xpPopup, setXpPopup] = useState(null);

  // Inicializar preguntas
  useEffect(() => {
    if (!quiz) {
      navigate('/');
      return;
    }
    const newShuffledQuestions = shuffleArray(quiz.questions);
    setShuffledQuestions(newShuffledQuestions);
    setAnswers(newShuffledQuestions.map(q => ({ ...q, userChoice: null, isCorrect: false })));
  }, [quiz, navigate]);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  // Voz de la pregunta
  useEffect(() => {
    if (!currentQuestion) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    speechSynthesis.speak(utterance);
  }, [currentQuestion, language]);

  // Temporizador
  useEffect(() => {
    if (time > 0 && !showResult) {
      const timerId = setInterval(() => setTime(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (time === 0 && !showResult) {
      handleAnswer(null);
    }
  }, [time, showResult]);

  // Guardar progreso
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

      // XP y monedas
      const xp = parseInt(localStorage.getItem('xp') || '0', 10) + scoreDifference * 10;
      const coins = parseInt(localStorage.getItem('coins') || '0', 10) + scoreDifference * 5;
      localStorage.setItem('xp', xp);
      localStorage.setItem('coins', coins);

      setXpPopup({ xp: scoreDifference * 10, coins: scoreDifference * 5 });
      setTimeout(() => setXpPopup(null), 1500);

      // Retos diarios
      const today = new Date().toDateString();
      const challenges = JSON.parse(localStorage.getItem('challenges') || '[]');
      const updatedChallenges = challenges.map(c => {
        if (c.date === today) {
          if (c.text.includes('lecciones') || c.text.includes('lessons')) {
            return { ...c, done: Math.min(c.done + 1, c.goal) };
          }
          if (c.text.includes('racha') || c.text.includes('streak')) {
            const streak = parseInt(localStorage.getItem('streak') || '0', 10);
            return { ...c, done: streak };
          }
        }
        return c;
      });
      localStorage.setItem('challenges', JSON.stringify(updatedChallenges));
    }
  };

  // Manejar respuesta
  const handleAnswer = (option) => {
    const isCorrect = option === currentQuestion.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex].userChoice = option;
    newAnswers[currentQuestionIndex].isCorrect = isCorrect;
    setAnswers(newAnswers);

    const audio = new Audio(isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3');
    audio.play();

    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      setFeedback(null);
      if (currentQuestionIndex < shuffledQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTime(30);
      } else {
        saveProgress(isCorrect ? score + 1 : score);
        setShowResult(true);
      }
    }, 1000);
  };

  if (!quiz || shuffledQuestions.length === 0) return null;

  const progressTime = (time / 30) * 100;
  const progressQuestions = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

  if (showResult) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <h2 className="text-4xl font-bold text-green-600 mb-4">
          {language === 'es' ? '¡Terminaste el Quiz!' : 'You finished the Quiz!'}
        </h2>
        <p className="text-2xl text-gray-700 mb-6">
          {language === 'es' 
            ? `Obtuviste ${score} de ${shuffledQuestions.length} correctas.` 
            : `You got ${score} out of ${shuffledQuestions.length} correct.`}
        </p>

        <div className="text-left mt-8">
          <h3 className="text-2xl font-bold mb-4">
            {language === 'es' ? 'Revisión de Respuestas' : 'Answer Review'}
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {answers.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg shadow-sm ${item.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {item.isCorrect ? <FaCheckCircle className="text-green-500" /> : <FaTimesCircle className="text-red-500" />}
                  <p className="font-semibold">{item.text}</p>
                </div>
                <p className="text-sm">
                  {language === 'es' ? 'Tu respuesta:' : 'Your answer:'} <span className="font-medium">{item.userChoice || (language === 'es' ? 'No respondiste' : 'No answer')}</span>
                </p>
                {!item.isCorrect && (
                  <p className="text-sm">
                    {language === 'es' ? 'Correcta:' : 'Correct:'} <span className="font-medium text-green-600">{item.correctAnswer}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-8 bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-blue-600 transition-colors"
        >
          {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-xl shadow-lg relative">
      {xpPopup && (
        <div className="absolute top-4 right-4 bg-green-200 px-4 py-2 rounded-lg font-bold animate-bounce">
          +{xpPopup.xp} XP +{xpPopup.coins} 💎
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-3xl font-bold text-blue-600">{quiz.title[language] || quiz.title}</h2>
        <span className="text-xl font-bold text-gray-600">
          {language === 'es' 
            ? `Pregunta ${currentQuestionIndex + 1} de ${shuffledQuestions.length}` 
            : `Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`}
        </span>
      </div>

      {/* Barra de progreso de preguntas */}
      <div className="w-full bg-gray-300 rounded-full h-3 mb-2">
        <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${progressQuestions}%` }}></div>
      </div>

      {/* Barra de tiempo */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
        <div className="bg-red-500 h-full transition-all duration-1000 ease-linear" style={{ width: `${progressTime}%` }}></div>
      </div>
      <p className="text-center text-red-500 font-bold text-lg mb-4 flex items-center justify-center">
        <FaClock className="mr-2" /> 
        {language === 'es' ? `Tiempo restante: ${time}s` : `Time remaining: ${time}s`}
      </p>

      <p className="text-2xl font-semibold text-gray-800 mb-8">{currentQuestion.text[language] || currentQuestion.text}</p>
      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="p-4 border border-gray-300 rounded-lg text-left text-xl font-medium hover:bg-blue-100 transition-colors duration-300 relative"
          >
            {option[language] || option}
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
