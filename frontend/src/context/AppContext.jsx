import { createContext, useContext, useEffect, useState } from "react";

import {
  getCart,
  saveCart,
  getFormData,
  saveFormData,
} from "../utils/cartStorage";

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

  /* ================= LOAD ON START ================= */
  useEffect(() => {
    setCartItems(getCart());

    const savedForm = getFormData();

    if (savedForm) {
      setFormData(savedForm);
    }
  }, []);

  /* ================= SAVE CART ================= */
  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  /* ================= SAVE FORM ================= */
  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  /* ================= ADD ITEM ================= */
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

  /* ================= DECREASE ITEM ================= */
  const decreaseItem = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i._id === id
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  /* ================= CLEAR EVERYTHING ================= */
  const clearAll = () => {
    const emptyForm = {
      name: "",
      designation: "",
      department: "",
      purpose: "",
    };

    setCartItems([]);
    setFormData(emptyForm);

    saveCart([]);
    saveFormData(emptyForm);
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        decreaseItem,

        formData,
        setFormData,

        clearAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);