import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { toast } from "react-toastify";
import TopBar2 from "../components/TopBar2";
import TextBox from "../components/TextBox";
import bgImage from "../assets/tupBg.jpg";
import api from "../api/axios.js";

const Suggest = () => {
  const [formData, setFormData] = useState({
    name: "",
    suggestion: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/suggest", formData);

      toast.success("Suggestion submitted successfully!");

      setFormData({
        name: "",
        suggestion: "",
      });
    } catch (error) {
      toast.error("Failed to submit suggestion");
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
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold mb-4 text-gray-300">
              Create Suggetion <br />
              for Additional Items
            </h1>
            <PackageOpen size={200} className="text-gray-300" />
          </div>

          <div className="w-full md:w-96">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <TextBox
                name="name"
                placeholder="Name/Department"
                value={formData.name}
                onChange={handleChange}
                className="rounded-lg bg-transparent text-gray-300"
              />

              <textarea
                name="suggestion"
                placeholder="Suggestion"
                rows={4}
                value={formData.suggestion}
                onChange={handleChange}
                className="input-bordered w-full rounded-lg pl-3 border border-gray-500 hover:border-[#E83838] 
                focus:border-[#E83838] focus:outline-none focus:ring-0 focus:shadow-none transition bg-transparent text-white"
              ></textarea>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#9B1805] hover:bg-[#E83838] text-white rounded-lg transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggest;
