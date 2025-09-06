import React from "react";
import { Link } from "react-router-dom";
import { quizzes } from "../data/quizzes";
import { FaLock, FaCheckCircle, FaPlay } from "react-icons/fa";

const LessonMap = ({ quizScores }) => {
  return (
    <div className="flex flex-col items-center gap-16 mt-12 relative">
      {quizzes.map((quiz, index) => {
        const isUnlocked = index === 0 || quizScores[quizzes[index - 1].id] > 0;
        const isCompleted = quizScores[quiz.id] > 0;

        // Estado visual
        const nodeClasses = isCompleted
          ? "bg-green-500 border-green-600 animate-bounce"
          : isUnlocked
          ? "bg-blue-500 border-blue-600 animate-pulse"
          : "bg-gray-300 border-gray-400";

        return (
          <div
            key={quiz.id}
            className="relative flex flex-col items-center"
            style={{
              marginLeft: index % 2 === 0 ? "0px" : "160px", // zig-zag
            }}
          >
            {/* Nodo principal */}
            <div
              className={`rounded-full border-4 shadow-lg flex flex-col items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-110 ${nodeClasses}`}
              style={{
                minWidth: "100px",
                minHeight: "100px",
                padding: "16px",
                textAlign: "center",
              }}
            >
              {isUnlocked ? (
                <Link
                  to={`/quiz/${quiz.id}`}
                  className="flex flex-col items-center justify-center text-center"
                >
                  {isCompleted ? (
                    <FaCheckCircle className="text-3xl mb-2" />
                  ) : (
                    <FaPlay className="text-3xl mb-2" />
                  )}
                  <span className="text-sm break-words">{quiz.title}</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-600 text-center">
                  <FaLock className="text-3xl mb-2" />
                  <span className="text-sm break-words">{quiz.title}</span>
                </div>
              )}
            </div>

            {/* Línea conectora */}
            {index < quizzes.length - 1 && (
              <div
                className="absolute w-1 bg-gray-400"
                style={{
                  top: "110%",
                  height: "80px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default LessonMap;
