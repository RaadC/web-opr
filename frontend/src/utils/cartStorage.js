const CART_KEY = "cart_items";
const FORM_KEY = "form_data";

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const getFormData = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(FORM_KEY)) || {
        name: "",
        designation: "",
        department: "",
        purpose: "",
      }
    );
  } catch {
    return {
      name: "",
      designation: "",
      department: "",
      purpose: "",
    };
  }
};

export const saveFormData = (data) => {
  localStorage.setItem(FORM_KEY, JSON.stringify(data));
};
