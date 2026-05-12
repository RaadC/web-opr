import { createContext, useContext, useEffect, useState } from "react";
import { getCart, saveCart } from "../utils/cartStorage";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  /* ================= CART ================= */
  const [cartItems, setCartItems] = useState([]);

  /* ================= FORM ================= */
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    purpose: "",
  });

  /* LOAD CART ON START */
  useEffect(() => {
    setCartItems(getCart());
  }, []);

  /* SAVE CART */
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  /* ADD ITEM */
  const addToCart = (item, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);

      if (existing) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }

      return [...prev, { ...item, quantity: qty }];
    });
  };

  /* DECREASE ITEM */
  const decreaseItem = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i._id === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  /* CLEAR EVERYTHING (AFTER PRINT) */
  const clearAll = () => {
    setCartItems([]);
    setFormData({
      name: "",
      designation: "",
      department: "",
      purpose: "",
    });
    saveCart([]);
  };

  return (
    <AppContext.Provider
      value={{
        /* CART */
        cartItems,
        setCartItems,
        addToCart,
        decreaseItem,

        /* FORM */
        formData,
        setFormData,

        /* GLOBAL ACTION */
        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);