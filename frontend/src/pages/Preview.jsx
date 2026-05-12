import { Link, useNavigate } from "react-router-dom";
import { Minus } from "lucide-react";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import TopBar2 from "../components/TopBar2";
import api from "../api/axios.js";
import { getCart, saveCart, clearCart } from "../utils/cartStorage";

const Preview = ({ formData, setFormData, setCartItems }) => {
  const navigate = useNavigate();

  const [cartItems, setLocalCart] = useState([]);

  /* LOAD CART FROM LOCALSTORAGE */
  useEffect(() => {
    const stored = getCart();
    setLocalCart(stored);
    setCartItems(stored);
  }, []);

  /* SYNC ON CHANGE */
  useEffect(() => {
    saveCart(cartItems);
    setCartItems(cartItems);
  }, [cartItems]);

  /* REDIRECT IF EMPTY */
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/", { replace: true });
    }
  }, [cartItems, navigate]);

  const grandTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  /* REMOVE / DECREASE ITEM */
  const handleMinus = (itemId) => {
    setLocalCart((prev) => {
      const updated = prev
        .map((i) =>
          i._id === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0);

      saveCart(updated);
      return updated;
    });
  };

  /* PRINT + SAVE + EXPORT */
  const handlePrint = async () => {
    try {
      const signatoryRes = await api.get("/signatory");

      const signatoryName =
        signatoryRes.data.length > 0 ? signatoryRes.data[0].name : null;

      const payload = {
        name: formData.name,
        designation: formData.designation,
        department: formData.department,
        purpose: formData.purpose,
        items: cartItems,
        totalAmount: grandTotal,
        signatory: signatoryName,
        createdAt: new Date(),
      };

      const response = await api.post("/purchase-request", payload);
      const savedId = response.data._id;

      toast.success("Purchase Request Saved Successfully!");

      const excelResponse = await api.get(
        `/purchase-request/export/${savedId}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([excelResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `purchase_${savedId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error saving or exporting:", error);
      toast.error("Something went wrong, but request may have been saved.");
    } finally {
      setLocalCart([]);
      saveCart([]);

      setCartItems([]);

      setFormData({
        name: "",
        designation: "",
        department: "",
        purpose: "",
      });

      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <TopBar2 />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-semibold">Purchase Request Preview</h1>
        </div>

        <div className="flex justify-center">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-8">

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 mb-6">
              <Link to="/" className="btn btn-outline btn-md">
                Back
              </Link>

              <button
                onClick={handlePrint}
                className="btn btn-primary btn-md px-3 bg-[#9B1805] hover:bg-[#E83838] text-white"
              >
                Print
              </button>
            </div>

            {/* FORM DATA */}
            <div className="mb-8 border-b pb-6">
              <div className="space-y-3 text-gray-700">
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>Designation:</strong> {formData.designation}</p>
                <p><strong>Department:</strong> {formData.department}</p>
                <p><strong>Purpose:</strong> {formData.purpose}</p>
              </div>
            </div>

            {/* ITEMS */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Items</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-500">No items added.</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => {
                    const price = Number(item.price) || 0;
                    const qty = Number(item.quantity) || 0;
                    const subtotal = price * qty;

                    return (
                      <div
                        key={item._id}
                        className="flex items-center border p-4 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            ₱{price.toFixed(2)} x {qty}
                          </p>
                        </div>

                        <div className="flex items-center gap-6">
                          <p className="font-semibold min-w-[90px] text-right">
                            ₱{subtotal.toFixed(2)}
                          </p>

                          <button
                            onClick={() => handleMinus(item._id)}
                            className="btn btn-circle btn-sm bg-[#9B1805] hover:bg-[#E83838] text-white border-none"
                          >
                            <Minus size={20} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* TOTAL */}
            <div className="border-t pt-6 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₱{grandTotal.toFixed(2)}</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Preview;