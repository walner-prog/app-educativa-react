import React, { useState, useEffect } from "react";
import { FaBolt, FaLock, FaCheckCircle, FaStar, FaMedal, FaTrophy } from "react-icons/fa";
import { motion } from "framer-motion";

// Mapeo de iconos para los desafíos
const iconsMap = {
  bolt: <FaBolt className="text-yellow-400 text-lg" />,
  star: <FaStar className="text-blue-400 text-lg" />,
  medal: <FaMedal className="text-pink-400 text-lg" />,
  trophy: <FaTrophy className="text-green-400 text-lg" />
};

const Challenges = () => {
  const [challenges, setChallenges] = useState([
    { id: 1, title: "Gana 10 EXP", progress: 0, goal: 10, completed: false, icon: "bolt", reward: "10 EXP" },
    { id: 2, title: "Responde 5 preguntas", progress: 0, goal: 5, completed: false, icon: "star", reward: "5 EXP" },
    { id: 3, title: "Completa 3 lecciones", progress: 0, goal: 3, completed: false, icon: "medal", reward: "20 Gemas" },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("challenges");
    if (saved) setChallenges(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("challenges", JSON.stringify(challenges));
  }, [challenges]);

  const addProgress = (id) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, progress: c.progress + 1, completed: c.progress + 1 >= c.goal }
          : c
      )
    );
  };

  return (
    <div className="max-w-md w-full p-4">
      {/* Sección de desafíos activos */}
      <h2 className="text-gray-800 dark:text-gray-200 text-lg font-bold mb-3 flex items-center">
        Desafíos del día
        <span className="ml-auto text-sm font-normal text-gray-500">15 HORAS</span>
      </h2>
      <div className="space-y-3">
        {challenges.map((c) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white dark:bg-gray-700 rounded-2xl shadow p-4 border border-gray-200 dark:border-gray-600 flex flex-col"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-full ${c.completed ? "bg-green-100 dark:bg-green-700" : "bg-yellow-100 dark:bg-yellow-700"}`}>
                  {iconsMap[c.icon]}
                </span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{c.title}</span>
              </div>
              {c.completed ? (
                <span className="text-green-500 flex items-center gap-1 font-bold text-sm">
                  <FaCheckCircle /> Completado
                </span>
              ) : (
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {c.progress} / {c.goal}
                </span>
              )}
            </div>
            {/* Barra de progreso */}
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 relative overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ease-out ${c.completed ? "bg-green-500" : "bg-yellow-400"}`}
                style={{ width: `${(c.progress / c.goal) * 100}%` }}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: c.completed ? 1 : 0 }}
                transition={{ delay: 0.5 }}
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-xs font-bold text-white z-10"
              >
                ✔
              </motion.div>
            </div>
            {/* Recompensa */}
            <div className="mt-2 flex justify-end">
                <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1 text-xs font-semibold">
                    Recompensa: {c.reward}
                </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sección de desafíos pendientes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4 p-4 flex items-center justify-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl"
      >
        <FaLock className="mr-2" />
        <span className="text-sm">Estamos preparando más desafíos</span>
      </motion.div>
    </div>
  );
};

export default Challenges;