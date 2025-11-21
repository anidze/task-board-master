import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiPlus, FiCheckCircle } from "react-icons/fi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Header */}
      <div
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-6"
        style={{ boxShadow: "0 10px 40px #00000033" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5E8D5" }}
            >
              <FiCheckCircle className="text-2xl" style={{ color: "#E9A23B" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#3662E3" }}>
                Dashboard - {user.FullName}
              </h1>
              <p className="text-sm" style={{ color: "#97A3B6" }}>
                Manage your tasks and projects
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{
              backgroundColor: "#DD524C",
              boxShadow: "0 4px 15px #DD524C66",
            }}
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className="bg-white rounded-2xl p-6 shadow-lg"
          style={{ boxShadow: "0 10px 40px #00000033" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5E8D5" }}
            >
              <span className="text-2xl">📋</span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#F5E8D5", color: "#E9A23B" }}
            >
              Total
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1" style={{ color: "#E9A23B" }}>
            0
          </h3>
          <p className="text-sm" style={{ color: "#97A3B6" }}>
            Total Tasks
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-lg"
          style={{ boxShadow: "0 10px 40px #00000033" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5D565" }}
            >
              <span className="text-2xl">⏰</span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#F5D565", color: "#E9A23B" }}
            >
              Active
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1" style={{ color: "#E9A23B" }}>
            0
          </h3>
          <p className="text-sm" style={{ color: "#97A3B6" }}>
            In Progress
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-lg"
          style={{ boxShadow: "0 10px 40px #00000033" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#A0ECB1" }}
            >
              <span className="text-2xl">✅</span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#A0ECB1", color: "#32D657" }}
            >
              Done
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1" style={{ color: "#32D657" }}>
            0
          </h3>
          <p className="text-sm" style={{ color: "#97A3B6" }}>
            Completed
          </p>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-lg"
          style={{ boxShadow: "0 10px 40px #00000033" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F7D4D3" }}
            >
              <span className="text-2xl">⚠️</span>
            </div>
            <span
              className="px-3 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#F7D4D3", color: "#DD524C" }}
            >
              Alert
            </span>
          </div>
          <h3 className="text-3xl font-bold mb-1" style={{ color: "#DD524C" }}>
            0
          </h3>
          <p className="text-sm" style={{ color: "#97A3B6" }}>
            Overdue
          </p>
        </div>
      </div>

      {/* Task Board */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#3662E3" }}>
            Task Board
          </h2>
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
            style={{
              backgroundColor: "#3662E3",
              boxShadow: "0 4px 15px #3662E366",
            }}
          >
            <FiPlus />
            New Task
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* To Do Column */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg"
            style={{ boxShadow: "0 10px 40px #00000033" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#E9A23B" }}
              ></div>
              <h3 className="font-bold text-lg" style={{ color: "#E9A23B" }}>
                To Do
              </h3>
              <span
                className="ml-auto px-2 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#F5E8D5", color: "#E9A23B" }}
              >
                0
              </span>
            </div>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center"
              style={{ borderColor: "#E3E8EF" }}
            >
              <p className="text-sm" style={{ color: "#97A3B6" }}>
                No tasks yet. Click "New Task" to get started.
              </p>
            </div>
          </div>

          {/* In Progress Column */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg"
            style={{ boxShadow: "0 10px 40px #00000033" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#3662E3" }}
              ></div>
              <h3 className="font-bold text-lg" style={{ color: "#3662E3" }}>
                In Progress
              </h3>
              <span
                className="ml-auto px-2 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#E3E8EF", color: "#3662E3" }}
              >
                0
              </span>
            </div>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center"
              style={{ borderColor: "#E3E8EF" }}
            >
              <p className="text-sm" style={{ color: "#97A3B6" }}>
                Drag tasks here when you start working on them.
              </p>
            </div>
          </div>

          {/* Done Column */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg"
            style={{ boxShadow: "0 10px 40px #00000033" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: "#32D657" }}
              ></div>
              <h3 className="font-bold text-lg" style={{ color: "#32D657" }}>
                Done
              </h3>
              <span
                className="ml-auto px-2 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "#A0ECB1", color: "#32D657" }}
              >
                0
              </span>
            </div>
            <div
              className="border-2 border-dashed rounded-xl p-8 text-center"
              style={{ borderColor: "#E3E8EF" }}
            >
              <p className="text-sm" style={{ color: "#97A3B6" }}>
                Completed tasks will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
