import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { quizzes } from "../data/quizzes";
import LessonMap from "../components/LessonMap";
import {
  FaGraduationCap,
  FaPlayCircle,
  FaBook,
  FaBrain,
  FaFlask,
  FaFire,
  FaMedal,
  FaGem,
} from "react-icons/fa";
import confetti from "canvas-confetti";

const Home = () => {
  const [quizScores, setQuizScores] = useState({});
  const [globalScore, setGlobalScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [nivel, setNivel] = useState("");
  const [xp, setXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [challenges, setChallenges] = useState([]);

  // Nivel según puntaje
  const getNivel = (score) => {
    if (score < 10) return "Novato 🌱";
    if (score < 30) return "Aprendiz 📘";
    if (score < 60) return "Intermedio 🚀";
    return "Maestro 🏆";
  };

  // Inicializar datos
  useEffect(() => {
    // Puntajes
    const scores = JSON.parse(localStorage.getItem("quizScores") || "{}");
    setQuizScores(scores);

    const global = parseInt(localStorage.getItem("globalScore") || "0", 10);
    setGlobalScore(global);

    const total = quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0);
    setTotalQuestions(total);

    // Racha
    const today = new Date().toDateString();
    const lastPlayDate = localStorage.getItem("lastPlayDate");
    let currentStreak = parseInt(localStorage.getItem("streak") || "0", 10);

    if (lastPlayDate === today) {
      // ya jugó hoy
    } else if (
      lastPlayDate &&
      new Date(today) - new Date(lastPlayDate) === 86400000
    ) {
      currentStreak += 1;
    } else {
      currentStreak = 1;
    }

    localStorage.setItem("streak", currentStreak);
    localStorage.setItem("lastPlayDate", today);
    setStreak(currentStreak);

    // XP y monedas
    const storedXp = parseInt(localStorage.getItem("xp") || "0", 10);
    const storedCoins = parseInt(localStorage.getItem("coins") || "0", 10);
    setXp(storedXp);
    setCoins(storedCoins);

    // Retos diarios
    const storedChallenges = JSON.parse(localStorage.getItem("challenges") || "[]");
    if (!storedChallenges.find(c => c.date === today)) {
      const newChallenges = [
        { id: 1, text: "Completa 3 lecciones hoy", done: 0, goal: 3, date: today },
        { id: 2, text: "Mantén tu racha 5 días", done: currentStreak, goal: 5, date: today },
      ];
      localStorage.setItem("challenges", JSON.stringify(newChallenges));
      setChallenges(newChallenges);
    } else {
      setChallenges(storedChallenges);
    }
  }, []);

  // Nivel y confeti
  useEffect(() => {
    const nuevoNivel = getNivel(globalScore);
    const nivelAnterior = localStorage.getItem("nivel") || "";
    setNivel(nuevoNivel);

    if (nivelAnterior && nivelAnterior !== nuevoNivel) {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }

    localStorage.setItem("nivel", nuevoNivel);
  }, [globalScore]);

  // Progreso global
  const progressPercentage =
    totalQuestions > 0 ? (globalScore / totalQuestions) * 100 : 0;

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += 1;
      if (start >= progressPercentage) {
        start = progressPercentage;
        clearInterval(interval);
      }
      setDisplayProgress(start);
    }, 20);
    return () => clearInterval(interval);
  }, [progressPercentage]);

  const circleStyle = {
    background: `conic-gradient(#3B82F6 ${displayProgress}%, #E5E7EB ${displayProgress}%)`,
  };

  const getQuizIcon = (quizTitle) => {
    switch (quizTitle.toLowerCase()) {
      case "matemáticas":
        return <FaBrain className="text-blue-500 text-3xl mb-2" />;
      case "historia":
        return <FaBook className="text-blue-500 text-3xl mb-2" />;
      case "ciencia":
        return <FaFlask className="text-blue-500 text-3xl mb-2" />;
      default:
        return <FaPlayCircle className="text-blue-500 text-3xl mb-2" />;
    }
  };

  return (
    <div className="text-center w-full max-w-5xl mx-auto px-4">
      {/* Título */}
      <h1 className="text-5xl font-extrabold text-blue-600 mb-8 animate-bounce">
        <FaGraduationCap className="inline-block mr-4 text-6xl" />
        ¡Hola! ¿Qué quieres aprender hoy?
      </h1>

      {/* Gráfico de progreso */}
      <div className="mb-8 flex flex-col items-center">
        <div className="flex gap-8 mb-4">
          <div className="text-center">
            <p className="font-bold text-lg text-purple-600">XP</p>
            <p className="text-2xl font-bold">{xp}</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-yellow-500">💎 Monedas</p>
            <p className="text-2xl font-bold">{coins}</p>
          </div>
        </div>

        <div
          className="relative w-40 h-40 rounded-full flex items-center justify-center shadow-lg mb-2"
          style={circleStyle}
        >
          <div className="absolute w-32 h-32 bg-white rounded-full flex items-center justify-center">
            <span className="text-4xl font-extrabold text-blue-500">
              {Math.round(displayProgress)}%
            </span>
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-700">
          Puntaje Global: <span className="text-blue-500">{globalScore}</span> de {totalQuestions} puntos
        </p>
        <div className="mt-2 flex items-center gap-4 justify-center">
          <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
            <FaMedal /> {nivel}
          </div>
          <div className="flex items-center gap-2 text-lg font-semibold text-orange-500">
            <FaFire /> Racha: {streak} días
          </div>
        </div>
      </div>

      {/* Retos */}
      <div className="bg-gray-100 p-4 rounded-xl mb-12">
        <h3 className="text-xl font-bold mb-2">Retos del día</h3>
        <ul className="space-y-2">
          {challenges.map(c => (
            <li key={c.id} className="flex justify-between">
              <span>{c.text}</span>
              <span>{c.done}/{c.goal}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Inicio */}
      <div className="bg-blue-100 p-6 rounded-xl shadow-lg mb-12">
        <h2 className="text-3xl font-bold text-blue-800 mb-2">¡Comienza tu aprendizaje!</h2>
        <p className="text-lg text-blue-700 mb-4">
          Gana puntos y mide tu progreso completando cada actividad. ¡El conocimiento es poder!
        </p>
        <Link
          to={`/quiz/${quizzes[0].id}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <FaPlayCircle className="mr-2 text-xl" /> ¡Empieza ahora!
        </Link>
      </div>

      {/* Camino oficial */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Camino oficial</h2>
      <LessonMap quizScores={quizScores} />

      {/* Práctica libre */}
      <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">Práctica libre</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.id}
            to={`/quiz/${quiz.id}`}
            className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 relative"
          >
            <div className="flex flex-col items-center">
              {getQuizIcon(quiz.title)}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
              <p className="text-gray-600 text-center">{quiz.description}</p>
            </div>
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
