import { useEffect, useState } from "react";
import { Trash, Printer } from "lucide-react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import TopBar3 from "../components/TopBar3";
import api from "../api/axios";

const ViewPurchase = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await api.get("/purchase-request");
      setPurchases(res.data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
      toast.error("Failed to fetch purchases");
    }
  };

  const handlePrint = async (id) => {
    try {
      const response = await api.get(`/purchase-request/export/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `purchase_${id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Excel file downloaded");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export file");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/purchase-request/${id}`);
      toast.success("Purchase request deleted");
      fetchPurchases();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/purchase-request");
      toast.success("All purchase requests deleted");
      fetchPurchases();
    } catch (error) {
      console.error("Clear all error:", error);
      toast.error("Failed to clear");
    }
  };

  return (
    <>
      <TopBar3 />

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">PR History</h1>

            <div className="flex gap-2">
              <Link to="/group-purchase" className="btn btn-outline btn-md">
                Group PR
              </Link>

              <button
                onClick={handleClearAll}
                className="btn btn-primary btn-md bg-[#9B1805] hover:bg-[#E83838] text-white px-3"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? (
                  purchases.map((purchase) => (
                    <tr key={purchase._id}>
                      <td>{purchase.name || "-"}</td>
                      <td>{purchase.department || "-"}</td>
                      <td>₱{purchase.totalAmount?.toFixed(2)}</td>
                      <td>
                        {new Date(purchase.createdAt).toLocaleDateString(
                          "en-PH",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </td>
                      <td className="flex gap-4">
                        <button
                          onClick={() => handlePrint(purchase._id)}
                          className="btn btn-sm text-green-600 hover:text-green-300 border-none"
                        >
                          <Printer size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(purchase._id)}
                          className="btn btn-sm text-red-600 hover:text-red-300 border-none"
                        >
                          <Trash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-400">
                      No purchase records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPurchase;
