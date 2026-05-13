import { Link } from "react-router-dom";

const TopBar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md py-4 bg-[#ffffff]">
      <div className="mx-auto w-full max-w-6xl px-6 flex items-center">
        {/* LEFT LOGO */}
        <div className="flex-1">
          <Link to="/" className="flex items-center">
            <img
              src="https://www.tupcavite.edu.ph/images/tup-logo.png"
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          <Link to="/about" className="btn btn-outline btn-md">
            About
          </Link>
          <Link to="/admin" className="btn btn-outline btn-md">
            Admin
          </Link>
          <Link
            to="/suggest"
            className="btn btn-primary btn-md bg-[#9B1805] hover:bg-[#E83838] text-white"
          >
            Suggest
          </Link>

          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Bagong_Pilipinas_logo.png/3840px-Bagong_Pilipinas_logo.png"
            alt="User"
            className="h-14 w-auto rounded-full object-cover cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
