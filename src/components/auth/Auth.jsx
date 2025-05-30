import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setMessage({ text: "", type: "" });
  };

  const handleSubmit = async () => {
    const { email, password, name, confirmPassword } = formData;

    if (!isLoginMode) {
      if (password !== confirmPassword) {
        showMessage("Passwords do not match", "error");
        return;
      }
      if (!name.trim()) {
        showMessage("Please enter your full name", "error");
        return;
      }
    }

    if (!email || !password) {
      showMessage("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLoginMode ? "/user/login" : "/user/register";
      const payload = isLoginMode
        ? { email, password }
        : { name, email, password };

      let response, data;
      try {
        response = await axios.post(endpoint, payload, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        data = response.data;
      } catch (err) {
        data = err.response?.data || {};
        if (!err.response) throw err;
      }

      if (response && response.status >= 200 && response.status < 300) {
        showMessage(
          isLoginMode
            ? "Successfully signed in!"
            : "Account created successfully!",
          "success"
        );
        console.log("Auth successful:", data);
        if (isLoginMode) {
          setTimeout(() => navigate("/"), 1000);
        }
      } else {
        showMessage(data.message || "Authentication failed", "error");
      }
    } catch (error) {
      showMessage("Network error. Please try again.", "error");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-20 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
      </div>

      {/* Auth Container */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 border border-white border-opacity-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-600 text-sm">
            {isLoginMode ? "Sign in to your account" : "Join us today"}
          </p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div
            className={`mb-6 p-3 rounded-lg text-center text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          {/* Name Field (Signup only) */}
          {!isLoginMode && (
            <div className="transform transition-all duration-300 ease-in-out">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white bg-opacity-80 focus:bg-opacity-100 focus:transform focus:-translate-y-1 focus:shadow-lg"
                required={!isLoginMode}
              />
            </div>
          )}

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white bg-opacity-80 focus:bg-opacity-100 focus:transform focus:-translate-y-1 focus:shadow-lg"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white bg-opacity-80 focus:bg-opacity-100 focus:transform focus:-translate-y-1 focus:shadow-lg"
              required
            />
          </div>

          {/* Confirm Password Field (Signup only) */}
          {!isLoginMode && (
            <div className="transform transition-all duration-300 ease-in-out">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white bg-opacity-80 focus:bg-opacity-100 focus:transform focus:-translate-y-1 focus:shadow-lg"
                required={!isLoginMode}
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:from-indigo-700 hover:to-purple-700"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </div>
            ) : isLoginMode ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </div>

        {/* Mode Switch */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm mb-3">
            {isLoginMode
              ? "Don't have an account?"
              : "Already have an account?"}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="px-6 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium transition-all duration-300 hover:bg-indigo-600 hover:text-white hover:transform hover:-translate-y-1"
          >
            {isLoginMode ? "Create Account" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
