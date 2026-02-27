const Textbox = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`
        input input-bordered w-full rounded-full pl-3 border border-gray-500 hover:border-[#E83838] 
        focus:border-[#E83838] focus:outline-none focus:ring-0 focus:shadow-none transition
        ${className}
      `}
    />
  );
};

export default Textbox;
