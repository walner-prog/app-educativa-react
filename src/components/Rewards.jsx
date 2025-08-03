import React, { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaLock } from 'react-icons/fa';

// Definimos las recompensas con iconos para ambos estados: desbloqueado y bloqueado
const rewardsData = [
  { 
    id: 1, 
    name: "Estrella de Plata", 
    pointsNeeded: 10, 
    unlockedIcon: <FaStar className="text-gray-400" />,
    lockedIcon: <FaLock className="text-gray-400" />
  },
  { 
    id: 2, 
    name: "Trofeo de Bronce", 
    pointsNeeded: 25, 
    unlockedIcon: <FaTrophy className="text-amber-700" />,
    lockedIcon: <FaLock className="text-gray-400" />
  },
  { 
    id: 3, 
    name: "Estrella Dorada", 
    pointsNeeded: 50, 
    unlockedIcon: <FaStar className="text-yellow-400" />,
    lockedIcon: <FaLock className="text-gray-400" />
  },
  { 
    id: 4, 
    name: "Trofeo de Plata", 
    pointsNeeded: 75, 
    unlockedIcon: <FaTrophy className="text-slate-400" />,
    lockedIcon: <FaLock className="text-gray-400" />
  },
  { 
    id: 5, 
    name: "Trofeo de Oro", 
    pointsNeeded: 100, 
    unlockedIcon: <FaTrophy className="text-yellow-500" />,
    lockedIcon: <FaLock className="text-gray-400" />
  },
];

const Rewards = () => {
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    const score = parseInt(localStorage.getItem('globalScore') || '0', 10);
    setGlobalScore(score);
  }, []);

  const unlockedRewards = rewardsData.filter(reward => globalScore >= reward.pointsNeeded);
  const lockedRewards = rewardsData.filter(reward => globalScore < reward.pointsNeeded);

  return (
    <div className="text-center w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-extrabold text-blue-600 mb-4">¡Mis Recompensas!</h1>
      <p className="text-2xl text-gray-700 mb-8">Tienes un total de <strong className="text-blue-500">{globalScore}</strong> puntos.</p>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Recompensas Desbloqueadas</h2>
        {unlockedRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedRewards.map(reward => (
              <div key={reward.id} className="p-6 bg-green-50 rounded-lg shadow-md flex items-center justify-center space-x-4">
                <span className="text-5xl">{reward.unlockedIcon}</span>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-green-700">{reward.name}</h3>
                  <p className="text-gray-600">¡Lo lograste con {reward.pointsNeeded} puntos!</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg">Aún no has desbloqueado ninguna recompensa. ¡Sigue jugando!</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Recompensas por Desbloquear</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedRewards.map(reward => (
            <div key={reward.id} className="p-6 bg-gray-200 rounded-lg shadow-md flex items-center justify-center space-x-4">
              <span className="text-5xl">{reward.lockedIcon}</span>
              <div className="text-left">
                <h3 className="text-xl font-bold text-gray-500">{reward.name}</h3>
                <p className="text-gray-500">Necesitas {reward.pointsNeeded} puntos.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;