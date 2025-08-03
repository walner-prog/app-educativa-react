import React, { useState, useEffect } from 'react';
import { FaTrophy, FaStar, FaLock } from 'react-icons/fa';

const rewardsData = [
  { id: 1, name: "Estrella de Plata", pointsNeeded: 10, icon: FaStar, color: "text-gray-400" },
  { id: 2, name: "Trofeo de Bronce", pointsNeeded: 25, icon: FaTrophy, color: "text-amber-700" },
  { id: 3, name: "Estrella Dorada", pointsNeeded: 50, icon: FaStar, color: "text-yellow-400" },
  { id: 4, name: "Trofeo de Plata", pointsNeeded: 75, icon: FaTrophy, color: "text-slate-400" },
  { id: 5, name: "Trofeo de Oro", pointsNeeded: 100, icon: FaTrophy, color: "text-yellow-500" },
];

// Se ordenan las recompensas por puntos de menor a mayor
rewardsData.sort((a, b) => a.pointsNeeded - b.pointsNeeded);

const Rewards = () => {
  const [globalScore, setGlobalScore] = useState(0);

  useEffect(() => {
    const score = parseInt(localStorage.getItem('globalScore') || '0', 10);
    setGlobalScore(score);
  }, []);

  return (
    <div className="text-center w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-4">¡Mis Recompensas!</h1>
      <p className="text-2xl text-gray-700 mb-8">Tienes un total de <strong className="text-blue-500">{globalScore}</strong> puntos.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewardsData.map(reward => {
          const isUnlocked = globalScore >= reward.pointsNeeded;
          const ProgressIcon = isUnlocked ? reward.icon : FaLock;
          
          let nextRewardPoints = 0;
          for (const r of rewardsData) {
            if (globalScore < r.pointsNeeded) {
              nextRewardPoints = r.pointsNeeded;
              break;
            }
          }

          const progressPercentage = nextRewardPoints > 0 
            ? Math.min(100, (globalScore / nextRewardPoints) * 100) 
            : 100;
          
          const progressStyle = {
            width: `${progressPercentage}%`,
          };

          return (
            <div
              key={reward.id}
              className={`p-6 rounded-xl shadow-lg flex flex-col items-center justify-center transition-all duration-300
                ${isUnlocked 
                  ? 'bg-gradient-to-br from-green-100 to-white transform scale-105 border-2 border-green-400' 
                  : 'bg-gray-100 border border-gray-300'}`
              }
            >
              <span className={`text-6xl mb-4 ${isUnlocked ? reward.color : 'text-gray-400'}`}>
                <ProgressIcon />
              </span>
              <div className="text-center">
                <h3 className={`text-xl font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                  {reward.name}
                </h3>
                <p className={`text-sm ${isUnlocked ? 'text-green-700' : 'text-gray-500'}`}>
                  {isUnlocked ? `¡Alcanzado con ${reward.pointsNeeded} puntos!` : `Necesitas ${reward.pointsNeeded} puntos`}
                </p>
              </div>

              {!isUnlocked && (
                <div className="w-full mt-4">
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full transition-all duration-500 ease-in-out" style={progressStyle}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Progreso hacia la siguiente recompensa: {globalScore} de {nextRewardPoints} puntos.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;