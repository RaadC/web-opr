import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";

import TopBar2 from "../components/TopBar2";
import bgImage from "../assets/tupBg.jpg";
import api from "../api/axios.js";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/view-pr");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/login", formData);

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!");

      navigate("/view-pr");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      toast.error("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar2 />

      <div
        className="relative flex flex-1 flex-col md:flex-row items-center justify-center gap-20 p-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative flex flex-1 flex-col md:flex-row items-center justify-center gap-20">
          {/* ===== LEFT DIV ===== */}
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-300">
              Admin Portal
            </h1>
            <ShieldCheck size={200} className="text-gray-300" />
          </div>

          {/* ===== RIGHT DIV ===== */}
          <div className="w-full md:w-96">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-500 bg-transparent px-3 py-2 text-white 
                focus:border-[#E83838] focus:outline-none"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-500 bg-transparent px-3 py-2 text-white 
                focus:border-[#E83838] focus:outline-none"
                required
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9B1805] hover:bg-[#E83838] text-white rounded-lg transition"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
