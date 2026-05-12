import { useState, useEffect } from "react";
import { Plus, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import TopBar from "../components/TopBar";
import SearchBar from "../components/SearchBar";
import TextBox from "../components/TextBox";
import ItemCard from "../components/ItemCard";
import api from "../api/axios.js";
import Footer from "../components/Footer.jsx";

import { useApp } from "../context/AppContext";

const Cart = () => {
  const navigate = useNavigate();

  const { cartItems, addToCart, formData, setFormData, clearAll } = useApp();

  //LOCAL UI STATE
  const [departments, setDepartments] = useState([]);
  const [items, setItems] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await api.get("/departments");
        setDepartments(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        setItemsError(null);

        const { data } = await api.get("/items");
        setItems(data);
      } catch (error) {
        console.error(error);
        setItemsError("Failed to load items. Please try again.");
        toast.error("Failed to load items");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreview = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.designation.trim())
      return toast.error("Designation is required");
    if (!formData.purpose.trim()) return toast.error("Purpose is required");
    if (!formData.department) return toast.error("Please select a department");
    if (cartItems.length === 0)
      return toast.error("Please add at least one item");

    navigate("/preview");
  };

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <TopBar />

      <div className="min-h-screen">
        {/* FLOAT BUTTON */}
        <button
          onClick={handlePreview}
          className="fixed top-24 right-6 btn btn-circle btn-lg z-50 shadow-lg 
          bg-[#9B1805] hover:bg-[#E83838] text-white border-none"
        >
          <Printer size={24} />
        </button>

        <div className="pl-10 pr-4 pt-6">
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
              TUPC Procurement Cart
            </h1>
            <p className="text-base sm:text-lg text-gray-500">
              Choose the product to be added on your purchase request.
            </p>
          </div>

          {/* FORM */}
          <div className="mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <TextBox
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />

              <TextBox
                name="designation"
                placeholder="Designation"
                value={formData.designation}
                onChange={handleChange}
              />

              <TextBox
                name="purpose"
                placeholder="Purpose"
                value={formData.purpose}
                onChange={handleChange}
              />

              <div className="flex items-center gap-3">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="select w-40 rounded-full pl-3 border border-gray-500 
                            hover:border-[#E83838] focus:border-[#E83838] focus:outline-none transition"
                >
                  <option value="">Department</option>

                  {departments.map((dept) => (
                    <option key={dept._id} value={dept.code}>
                      {dept.code}
                    </option>
                  ))}
                </select>

                <button
                  onClick={clearAll}
                  type="button"
                  className="btn btn-md bg-[#9B1805] hover:bg-[#E83838] text-white border-none"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type={selectedCategory}
              setType={setSelectedCategory}
              categories={categories}
            />
          </div>

          {loadingItems ? (
            <div className="text-center text-gray-500 py-10">
              Loading items...
            </div>
          ) : itemsError ? (
            <div className="text-center text-gray-500 py-10">{itemsError}</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              No items match your search.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onAction={addToCart}
                  Icon={Plus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
