import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getCart,
  saveCart,
  getFormData,
  saveFormData,
} from "../utils/cartStorage";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    department: "",
    purpose: "",
  });

  useEffect(() => {
    setCartItems(getCart());

    const savedForm = getFormData();

    if (savedForm) {
      setFormData(savedForm);
    }
  }, []);

  useEffect(() => {
    saveCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  const addToCart = (item, qty = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);

      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }

      return [...prev, { ...item, quantity: qty }];
    });

    toast.success(`${item.name} added (${qty})`);
  };

  const decreaseItem = (id) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0),
    );
  };

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

    toast.success("Cart cleared");
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
