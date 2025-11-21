import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Registration successful!");
        setFormData({ fullName: "", email: "", password: "" });
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Login successful!");
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: "#F8FAFC" }}
    >
      {/* Decorative Blur Elements */}
      <div
        className="absolute top-0 right-0 w-96 h-96 opacity-10"
        style={{
          backgroundColor: "#32D657",
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 opacity-10"
        style={{
          backgroundColor: "#3662E3",
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />

      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 relative z-10"
        style={{ boxShadow: "0 20px 60px #00000033" }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: "#F5E8D5" }}
            >
              <span className="text-3xl">✓</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold" style={{ color: "#3662E3" }}>
            Task Board
          </h1>
          <p style={{ color: "#97A3B6" }} className="text-sm mt-2">
            {isLogin
              ? "Welcome back, sign in to your account"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Tab Buttons */}
        <div
          className="flex gap-4 mb-8 p-1 rounded-xl"
          style={{ backgroundColor: "#E3E8EF" }}
        >
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              isLogin ? "text-white shadow-lg" : "text-gray-600"
            }`}
            style={{
              backgroundColor: isLogin ? "#3662E3" : "transparent",
            }}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              !isLogin ? "text-white shadow-lg" : "text-gray-600"
            }`}
            style={{
              backgroundColor: !isLogin ? "#32D657" : "transparent",
            }}
          >
            Register
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-xl text-center text-sm font-medium text-white`}
            style={{
              backgroundColor: message.includes("✅") ? "#32D657" : "#DD524C",
            }}
          >
            {message}
          </div>
        )}

        {/* LOGIN FORM */}
        {isLogin && (
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email */}
            <div className="relative">
              <FiMail
                className="absolute left-4 top-4"
                style={{ color: "#97A3B6" }}
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                style={{
                  borderColor: "#E3E8EF",
                  color: "#3662E3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3662E3")}
                onBlur={(e) => (e.target.style.borderColor = "#E3E8EF")}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock
                className="absolute left-4 top-4"
                style={{ color: "#97A3B6" }}
                size={20}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                style={{
                  borderColor: "#E3E8EF",
                  color: "#3662E3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#3662E3")}
                onBlur={(e) => (e.target.style.borderColor = "#E3E8EF")}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg disabled:opacity-60"
              style={{
                backgroundColor: "#3662E3",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {!isLogin && (
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="relative">
              <FiUser
                className="absolute left-4 top-4"
                style={{ color: "#97A3B6" }}
                size={20}
              />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                style={{
                  borderColor: "#E3E8EF",
                  color: "#3662E3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#32D657")}
                onBlur={(e) => (e.target.style.borderColor = "#E3E8EF")}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FiMail
                className="absolute left-4 top-4"
                style={{ color: "#97A3B6" }}
                size={20}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Email address"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                style={{
                  borderColor: "#E3E8EF",
                  color: "#3662E3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#32D657")}
                onBlur={(e) => (e.target.style.borderColor = "#E3E8EF")}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock
                className="absolute left-4 top-4"
                style={{ color: "#97A3B6" }}
                size={20}
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all focus:outline-none"
                style={{
                  borderColor: "#E3E8EF",
                  color: "#3662E3",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#32D657")}
                onBlur={(e) => (e.target.style.borderColor = "#E3E8EF")}
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white transition-all hover:shadow-lg disabled:opacity-60"
              style={{
                backgroundColor: "#32D657",
              }}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "#E3E8EF" }}>
          <p style={{ color: "#97A3B6" }} className="text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold transition-colors hover:underline"
              style={{ color: isLogin ? "#32D657" : "#3662E3" }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
