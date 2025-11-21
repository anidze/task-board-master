import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiEdit2, FiPlus } from "react-icons/fi";
import { IoPieChart } from "react-icons/io5";
import { FaCheck , FaXmark} from "react-icons/fa6";
export default function HomePage() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "#F8FAFC" }}>
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "#3662E3" }}>
            My Task Board
          </h1>
          <p style={{ color: "#97A3B6" }} className="text-sm mt-1">
            Tasks to keep organised
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
          style={{
            backgroundColor: "#DD524C",
            boxShadow: "0 4px 15px rgba(221, 82, 76, 0.4)",
          }}
        >
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* Tasks Section */}
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Task 1 - In Progress */}
        <div
          className="flex items-center justify-between p-6 rounded-2xl text-white font-bold text-lg"
          style={{
            backgroundColor: "#F5D565",
            color: "#333",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <span className="text-xl">⏰</span>
            </div>
            <span>Task in Progress</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-14 h-14 rounded-xl flex items-center justify-center hover:opacity-80 transition"
              style={{ backgroundColor: "#E9A23B" }}
            >
              <span className="text-white text-lg"><IoPieChart /></span>
            </button>
          </div>
        </div>

        {/* Task 2 - Completed */}
        <div
          className="flex items-center justify-between p-6 rounded-2xl text-white font-bold text-lg"
          style={{
            backgroundColor: "#A0ECB1",
            color: "#333",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <span className="text-xl">🏋️‍♂️</span>
            </div>
            <span>Task Completed</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-14 h-14 rounded-xl flex items-center justify-center hover:opacity-80 transition"
              style={{ backgroundColor: "#32D657" }}
            >
              <span className="text-white text-lg"><FaCheck /></span>
            </button>
          </div>
        </div>

        {/* Task 3 - Won't Do */}
        <div
          className="flex items-center justify-between p-6 rounded-2xl text-white font-bold text-lg"
          style={{
            backgroundColor: "#F7D4D3",
            color: "#333",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <span className="text-xl">🍸</span>
            </div>
            <span>Task Won't Do</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-14 h-14 rounded-xl flex items-center justify-center hover:opacity-80 transition"
              style={{ backgroundColor: "#DD524C" }}
            >
              <span className="text-white text-lg"><FaXmark /></span>
            </button>
          </div>
        </div>

        {/* Task 4 - To Do */}
        <div
          className="flex items-center justify-between p-6 rounded-2xl text-white font-bold text-lg"
          style={{
            backgroundColor: "#E3E8EF",
            color: "#333",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#F8FAFC" }}
            >
              <span className="text-xl">📚</span>
            </div>
            <div>
              <span>Task To Do</span>
              <p style={{ color: "#97A3B6" }} className="text-sm font-normal mt-1">
                Work on a Challenge on devChallenges.io, learn TypeScript.
              </p>
            </div>
          </div>
        </div>

        {/* Add New Task */}
        <button
          className="w-full flex items-center justify-left gap-3 p-6 rounded-2xl font-bold text-lg transition-all hover:shadow-lg"
          style={{
            backgroundColor: "#F5E8D5",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: "#E9A23B" }}
          >
            <FiPlus size={24} />
          </div>
          Add new task
        </button>
      </div>
    </div>
  );
}
