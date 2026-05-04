import { useState } from "react";

const ItemCard = ({ item, onAction, Icon }) => {
  const [qty, setQty] = useState(1);

  const handleChange = (e) => {
    let value = parseInt(e.target.value);

    if (isNaN(value) || value < 1) value = 1;

    setQty(value);
  };

  return (
    <div className="card p-4 border rounded-xl shadow-sm flex flex-col gap-2">
      {/* Item Name */}
      <h2 className="font-semibold text-sm">{item.name}</h2>

      {/* Price */}
      <p className="text-sm text-gray-500">
        ₱{item.price.toFixed(2)}
      </p>

      {/* ✅ Quantity Input INSIDE CARD */}
      <input
        type="number"
        min="1"
        value={qty}
        onChange={handleChange}
        className="input input-bordered w-full"
      />

      {/* Add Button */}
      <button
        onClick={() => {
          onAction(item, qty);
          setQty(1);
        }}
        className="btn mt-1 flex items-center justify-center gap-1"
      >
        <Icon size={16} />
        Add
      </button>
    </div>
  );
};

export default ItemCard;