import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import { FaBolt, FaShieldAlt, FaUserAstronaut, FaPalette, FaFireAlt, FaStar } from "react-icons/fa";

const Shop = () => {
  const [tokens, setTokens] = useState(100);
  const [energy, setEnergy] = useState(3);
  const [xpBoost, setXpBoost] = useState(false);
  const [streakProtector, setStreakProtector] = useState(false);
  const [dailyMission, setDailyMission] = useState({ goal: 20, progress: 0 });

  useEffect(() => {
    const saved = localStorage.getItem("shopData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setTokens(parsed.tokens || 100);
      setEnergy(parsed.energy || 3);
      setXpBoost(parsed.xpBoost || false);
      setStreakProtector(parsed.streakProtector || false);
      setDailyMission(parsed.dailyMission || { goal: 20, progress: 0 });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "shopData",
      JSON.stringify({ tokens, energy, xpBoost, streakProtector, dailyMission })
    );
  }, [tokens, energy, xpBoost, streakProtector, dailyMission]);

  const buyEnergy = () => {
    if (tokens >= 40) {
      setTokens(tokens - 40);
      setEnergy(energy + 1);
    } else {
      alert("No tienes suficientes ⚙️ Tokens");
    }
  };

  const buyXpBoost = () => {
    if (tokens >= 150 && !xpBoost) {
      setTokens(tokens - 150);
      setXpBoost(true);
    } else {
      alert("No puedes comprar esto ahora.");
    }
  };

  const buyStreakProtector = () => {
    if (tokens >= 250 && !streakProtector) {
      setTokens(tokens - 250);
      setStreakProtector(true);
    } else {
      alert("No puedes comprar esto ahora.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid md:grid-cols-3 gap-6 p-6">
      {/* --- CARD PRINCIPAL --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="md:col-span-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600 dark:text-indigo-400">
          🛒 Centro de Energía
        </h2>

        {/* Tokens y Energía */}
        <div className="flex justify-around mb-6">
          <motion.div whileHover={{ scale: 1.1 }} className="text-center">
            <FaStar className="text-yellow-400 text-4xl mb-1 animate-pulse" />
            <p className="font-bold">{tokens} Tokens</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} className="text-center">
            <FaBolt className="text-green-400 text-4xl mb-1 animate-bounce" />
            <p className="font-bold">{energy} Energía</p>
          </motion.div>
        </div>

        {/* Energía */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">🔋 Energía</h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={buyEnergy}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg w-full"
          >
            Recuperar energía (40 ⚙️ Tokens)
          </motion.button>
        </div>

        {/* Potenciadores */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">⚡ Potenciadores</h3>
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={buyXpBoost}
              disabled={xpBoost}
              className={`w-full px-4 py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                xpBoost
                  ? "bg-yellow-400 text-white cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <FaBolt /> {xpBoost ? "Doble XP activo ✅" : "Comprar Doble XP (150 ⚙️ Tokens)"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={buyStreakProtector}
              disabled={streakProtector}
              className={`w-full px-4 py-2 rounded-xl shadow-lg flex items-center justify-center gap-2 ${
                streakProtector
                  ? "bg-purple-500 text-white cursor-not-allowed"
                  : "bg-purple-400 hover:bg-purple-500 text-white"
              }`}
            >
              <FaShieldAlt />{" "}
              {streakProtector ? "Protector activo ✅" : "Comprar protector (250 ⚙️ Tokens)"}
            </motion.button>
          </div>
        </div>

        {/* Personalización */}
        <div className="mb-6 border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">🎨 Personalización</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button whileHover={{ scale: 1.05 }} className="bg-pink-500 text-white px-3 py-2 rounded-xl shadow-lg">
              <FaPalette /> Tema Rosa (100 ⚙️)
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="bg-gray-700 text-white px-3 py-2 rounded-xl shadow-lg">
              🌑 Tema Oscuro Pro (120 ⚙️)
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="bg-orange-500 text-white px-3 py-2 rounded-xl shadow-lg">
              <FaUserAstronaut /> Avatar Espacial (200 ⚙️)
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} className="bg-teal-500 text-white px-3 py-2 rounded-xl shadow-lg">
              🖼️ Marco de perfil (80 ⚙️)
            </motion.button>
          </div>
        </div>

        {/* Misión del día */}
        <div>
          <h3 className="text-lg font-semibold mb-2">🔥 Misión del día</h3>
          <p>
            Completa {dailyMission.goal} XP —{" "}
            <span className="font-bold">{dailyMission.progress}/{dailyMission.goal}</span>
          </p>
          <div className="w-full bg-gray-200 h-4 rounded-xl mt-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(dailyMission.progress / dailyMission.goal) * 100}%` }}
              transition={{ duration: 0.8 }}
              className="bg-orange-400 h-4"
            ></motion.div>
          </div>
        </div>
      </motion.div>

      {/* --- SIDE CARDS --- */}
      <div className="space-y-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-green-400 to-green-600 text-white p-4 rounded-2xl shadow-lg"
        >
          <h4 className="font-bold flex items-center gap-2">
            <FaFireAlt /> Tip del día
          </h4>
          <p className="text-sm mt-2">Estudia 10 min después de despertar y recordarás 30% más. 🌅</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-indigo-400 to-indigo-600 text-white p-4 rounded-2xl shadow-lg"
        >
          <h4 className="font-bold flex items-center gap-2">
            🌍 Curiosidad
          </h4>
          <p className="text-sm mt-2">El idioma con más hablantes nativos es el chino mandarín. 🀄</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-r from-pink-400 to-pink-600 text-white p-4 rounded-2xl shadow-lg"
        >
          <h4 className="font-bold flex items-center gap-2">
            💡 Motivación
          </h4>
          <p className="text-sm mt-2">Cada sesión suma. Tu constancia vale más que tu velocidad. 🚀</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Shop;
