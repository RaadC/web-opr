import { useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { toast } from "react-toastify";

import TopBar3 from "../components/TopBar3";
import api from "../api/axios";

const GroupPurchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  //FETCH PURCHASES
  const fetchPurchases = async () => {
    try {
      const res = await api.get("/purchase-request");
      setPurchases(res.data);
    } catch (error) {
      toast.error("Failed to fetch purchases");
    }
  };

  // ADD TO GROUP 
  const handleAdd = (purchase) => {
    if (selected.find((p) => p._id === purchase._id)) {
      return toast.warning("Already added");
    }

    setSelected((prev) => [...prev, purchase]);
  };

  //REMOVE FROM GROUP
  const handleRemove = (id) => {
    setSelected((prev) => prev.filter((p) => p._id !== id));
  };

  //EXPORT GROUP
  const handleGroupExport = async () => {
    if (selected.length === 0) {
      return toast.warning("No selected purchases");
    }

    try {
      const ids = selected.map((p) => p._id);

      const res = await api.post(
        "/purchase-request/group-export",
        { ids },
        { responseType: "blob" },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "grouped_purchase.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Grouped Excel downloaded");

      setSelected([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to export grouped file");
    }
  };

  return (
    <>
      <TopBar3 />

      <div className="min-h-screen bg-gray-100 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {
          //ALL PURCHASES
        }
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-xl font-semibold mb-4">All Purchases</h1>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {purchases.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.department}</td>
                    <td>₱{p.totalAmount?.toFixed(2)}</td>

                    <td>
                      <button
                        onClick={() => handleAdd(p)}
                        className="text-blue-600 p-2 rounded-full duration-200 hover:bg-blue-600 hover:text-white hover:shadow-lg active:scale-90"
                      >
                        <Plus size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {
          //DIV 2: SELECTED
        }
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-xl font-semibold mb-4">
            Selected ({selected.length})
          </h1>

          <div className="overflow-x-auto">
            <table className="table w-full mb-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {selected.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.department}</td>

                    <td>
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="text-red-600"
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleGroupExport}
            className="btn btn-primary btn-md bg-[#16a34a] hover:bg-[#22c55e] active:bg-[#15803d] text-white w-full border-none"
          >
            Group & Export
          </button>
        </div>
      </div>
    </>
  );
};

export default GroupPurchase;
