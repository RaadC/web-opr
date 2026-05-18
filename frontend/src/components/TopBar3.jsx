import { Link, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";

const TopBar3 = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  return (
    <div className="navbar !bg-[#ffffff] shadow-md py-4">
      <div className="mx-auto w-full max-w-6xl px-6 relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="md:hidden dropdown dropdown-start">
            <label tabIndex={0} className="btn btn-ghost">
              <Menu size={28} />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-4 shadow bg-white rounded-box w-52 space-y-2"
            >
              <MobileNavLinks handleLogout={handleLogout} />
            </ul>
          </div>

          <Link to="/" className="hidden md:block">
            <img
              src="tupLogo.png"
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="hidden md:flex gap-4">
          <NavLinks handleLogout={handleLogout} />
        </div>

        <div>
          <img
            src="/bpLogo.png"
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
          <Link to="/">
            <img
              src="/tupLogo.png"
              alt="Logo"
              className="h-14 w-auto object-contain"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

const NavLinks = ({ handleLogout }) => (
  <>
    <Link to="/manage-department" className="btn btn-outline btn-md">
      Department
    </Link>
    <Link to="/view-pr" className="btn btn-outline btn-md">
      PR
    </Link>
    <Link to="/items" className="btn btn-outline btn-md">
      Items
    </Link>
    <Link to="/view-suggestion" className="btn btn-outline btn-md">
      Suggest
    </Link>
    <button
      onClick={handleLogout}
      className="btn btn-primary bg-[#9B1805] hover:bg-[#E83838] text-white px-3"
    >
      Logout
    </button>
  </>
);

const MobileNavLinks = ({ handleLogout }) => (
  <>
    <li>
      <Link to="/manage-department" className="active:bg-gray-300">
        Department
      </Link>
    </li>
    <li>
      <Link to="/view-pr" className="active:bg-gray-300">
        PR
      </Link>
    </li>
    <li>
      <Link to="/items" className="active:bg-gray-300">
        Items
      </Link>
    </li>
    <li>
      <Link to="/view-suggestion" className="active:bg-gray-300">
        Suggest
      </Link>
    </li>
    <li>
      <button
        onClick={handleLogout}
        className="w-full text-left active:bg-gray-300"
      >
        Logout
      </button>
    </li>
  </>
);

export default TopBar3;
