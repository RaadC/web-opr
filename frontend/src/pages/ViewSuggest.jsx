import { useEffect, useState } from "react";
import { X } from "lucide-react";
import TopBar3 from "../components/TopBar3";
import api from "../api/axios";

const ViewSuggest = () => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await api.get("/suggest");
      setSuggestions(res.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/suggest/${id}`);
      fetchSuggestions();
    } catch (error) {
      console.error("Error deleting suggestion:", error);
    }
  };

  return (
    <>
      <TopBar3 />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Suggestions</h1>

          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {suggestions.length > 0 ? (
              suggestions.map((item) => (
                <div
                  key={item._id}
                  className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                >
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
                  >
                    <X size={18} />
                  </button>
                  <p className="text-sm text-gray-500 mb-2">
                    {new Date(item.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <h2 className="text-lg font-semibold mb-3">
                    {item.name || "Anonymous"}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {item.suggestion}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No suggestions found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSuggest;
