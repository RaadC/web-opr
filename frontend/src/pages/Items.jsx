import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash, Pencil, Plus } from "lucide-react";

import TopBar3 from "../components/TopBar3";
import api from "../api/axios";

const Items = () => {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    unit: "",
    category: "",
    imageUrl: "",
  });
  const [priceEditId, setPriceEditId] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const fetchItems = async () => {
    try {
      const res = await api.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async () => {
    const { name, price, unit, category } = newItem;

    if (!name || !price || !unit || !category) {
      toast.error("Enter complete details");
      return;
    }

    const itemToSave = {
      ...newItem,
      unit: unit.toLowerCase(),
      category: category.toLowerCase(),
    };

    try {
      await api.post("/items", itemToSave);

      setModalOpen(false);

      setNewItem({
        name: "",
        price: "",
        unit: "",
        category: "",
        imageUrl: "",
      });

      fetchItems();
      toast.success("Item added");
    } catch (err) {
      console.error("Error adding item:", err);
      toast.error("Failed to add item");
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`/items/${id}`);
      fetchItems();
      toast.success("Item deleted");
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const updatePrice = async () => {
    if (!priceEditId || !newPrice) return;

    try {
      await api.put(`/items/${priceEditId}/price`, { price: Number(newPrice) });
      setPriceEditId("");
      setNewPrice("");
      fetchItems();
      toast.success("Item price updated");
    } catch (err) {
      console.error("Error updating price:", err);
    }
  };

  return (
    <>
      <TopBar3 />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Items</h1>
            <button
              onClick={() => setModalOpen(true)}
              className="btn bg-[#9B1805] hover:bg-[#E83838] text-white flex items-center gap-2 px-2"
            >
              <Plus size={18} /> Add Item
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-2xl shadow-md p-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Unit</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>
                        {priceEditId === item._id ? (
                          <input
                            type="number"
                            className="input input-sm w-20 input-bordered  pl-1 border border-blue-700"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                          />
                        ) : (
                          `₱${item.price.toFixed(2)}`
                        )}
                      </td>
                      <td>{item.unit}</td>
                      <td>{item.category}</td>
                      <td className="flex justify-center gap-2">
                        {priceEditId === item._id ? (
                          <button
                            onClick={updatePrice}
                            className="btn btn-sm btn-success px-2 bg-blue-700 hover:bg-blue-500 text-white"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setPriceEditId(item._id);
                              setNewPrice(item.price);
                            }}
                            className="btn btn-circle btn-sm bg-blue-700 text-white"
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => deleteItem(item._id)}
                          className="btn btn-circle btn-sm bg-red-500 text-white"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-400 py-4">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <form onSubmit={addItem}>
              <h2 className="text-xl font-semibold mb-4">Add Item</h2>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    value={newItem.name}
                    onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                    }
                    maxLength={100}
                    className="input w-full input-bordered pl-1 border border-gray-500"
                  />

                  {newItem.name.length === 100 && (
                    <p className="text-red-500 text-sm mt-1">
                      Maximum 100 characters reached
                    </p>
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Price"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="input w-full input-bordered  pl-1 border border-gray-500"
                />
                <input
                  type="text"
                  placeholder="Unit (e.g., pcs)"
                  value={newItem.unit}
                  onChange={(e) =>
                    setNewItem({ ...newItem, unit: e.target.value })
                  }
                  className="input w-full input-bordered  pl-1 border border-gray-500"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem({ ...newItem, category: e.target.value })
                  }
                  className="input w-full input-bordered  pl-1 border border-gray-500"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newItem.imageUrl}
                  onChange={(e) =>
                    setNewItem({ ...newItem, imageUrl: e.target.value })
                  }
                  className="input w-full input-bordered  pl-1 border border-gray-500"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="btn hover:bg-gray-300 px-2"
                >
                  Cancel
                </button>
                <button
                  onClick={addItem}
                  className="btn bg-[#9B1805] hover:bg-[#E83838] text-white px-2"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Items;
