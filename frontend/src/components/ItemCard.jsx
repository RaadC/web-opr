const ItemCard = ({ item, onAction, Icon }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 flex flex-col">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-32 object-contain mb-4"
      />

      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-sm">{item.name}</h3>

        <button
          onClick={() => onAction(item)}
          className="btn btn-circle btn-sm bg-[#9B1805] 
          hover:bg-[#E83838] text-white border-none"
        >
          <Icon size={16} />
        </button>
      </div>

      <p className="text-sm text-gray-500">
        ₱{item.price} / {item.unit}
      </p>
    </div>
  );
};

export default ItemCard;
