import { useState } from "react";

const ItemCard = ({ item, onAction, Icon }) => {
  const [qty, setQty] = useState(1);

  const handleChange = (e) => {
    let value = parseInt(e.target.value);

    if (isNaN(value) || value < 1) value = 1;
    if (value > 100) value = 100; 

    setQty(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-32 object-contain mb-4"
      />

      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-sm">{item.name}</h3>

        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={qty}
            onChange={handleChange}
            className="w-14 h-8 text-sm text-center border rounded-md"
          />

          <button
            onClick={() => {
              onAction(item, qty);
              setQty(1); 
            }}
            className="btn btn-circle btn-sm bg-[#9B1805] 
            hover:bg-[#E83838] text-white border-none"
          >
            <Icon size={16} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        ₱{Number(item.price).toFixed(2)} / {item.unit}
      </p>
    </div>
  );
};

export default ItemCard;