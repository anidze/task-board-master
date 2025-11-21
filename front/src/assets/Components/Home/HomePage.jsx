import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiCheckCircle } from "react-icons/fi";

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
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Header */}
      <div
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 mb-6"
        style={{ boxShadow: "0 10px 40px #00000033" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#A0ECB1" }}
            >
              <FiCheckCircle className="text-2xl" style={{ color: "#32D657" }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#3662E3" }}>
                Welcome, {user.FullName}!
              </h1>
              <p className="text-sm" style={{ color: "#97A3B6" }}>
                {user.Email}
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div
          className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          style={{
            borderTop: "4px solid #3662E3",
            boxShadow: "0 10px 40px #00000033",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#F5E8D5" }}
          >
            <span className="text-3xl">📋</span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "#3662E3" }}>
            My Tasks
          </h3>
          <p style={{ color: "#97A3B6" }}>View and manage your tasks</p>
        </div>

        {/* Card 2 */}
        <div
          className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          style={{
            borderTop: "4px solid #E9A23B",
            boxShadow: "0 10px 40px #00000033",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#F5D565" }}
          >
            <span className="text-3xl">⏰</span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "#E9A23B" }}>
            In Progress
          </h3>
          <p style={{ color: "#97A3B6" }}>Tasks you are working on</p>
        </div>

        {/* Card 3 */}
        <div
          className="bg-white rounded-2xl p-6 shadow-lg hover:scale-105 transition-transform cursor-pointer"
          style={{
            borderTop: "4px solid #32D657",
            boxShadow: "0 10px 40px #00000033",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "#A0ECB1" }}
          >
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-xl font-bold mb-2" style={{ color: "#32D657" }}>
            Completed
          </h3>
          <p style={{ color: "#97A3B6" }}>Tasks you have finished</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="max-w-6xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6"
        style={{ boxShadow: "0 10px 40px #00000033" }}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: "#3662E3" }}>
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div
            className="p-4 rounded-xl"
            style={{ backgroundColor: "#F8FAFC", borderLeft: "4px solid #32D657" }}
          >
            <p className="font-semibold" style={{ color: "#32D657" }}>
              Account Created Successfully
            </p>
            <p className="text-sm" style={{ color: "#97A3B6" }}>
              Welcome to Task Board! Start organizing your tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
