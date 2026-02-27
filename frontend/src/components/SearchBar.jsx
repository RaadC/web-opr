import { Search, ChevronDown } from "lucide-react";

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  type,
  setType,
  categories = [],
}) => {
  return (
    <div className="flex justify-center">
      <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm w-full max-w-2xl px-3 py-2">
        {/* LEFT SEARCH ICON */}
        <Search className="text-gray-400 mr-2" size={20} />

        <input
          type="text"
          placeholder="Search by item name..."
          value={value}
          onChange={onChange}
          className="flex-1 outline-none bg-transparent text-sm sm:text-base"
        />

        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="flex items-center gap-1 cursor-pointer px-3 text-sm text-gray-600 hover:text-black"
          >
            {type}
            <ChevronDown size={16} />
          </label>

          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
          >
            {categories.map((opt) => (
              <li key={opt}>
                <button type="button" onClick={() => setType(opt)}>
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onSubmit}
          className="ml-2 btn btn-circle btn-sm text-[#9B1805] border-none bg-transparent hover:bg-gray-100"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
