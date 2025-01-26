import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AppBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-4 flex justify-between items-center text-gray-800 shadow-lg">
      <div className="text-xl font-semibold hidden sm:block">
        <Link to="/" className="hover:text-blue-500">
          Socify
        </Link>
      </div>

      {user ? (
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="hidden sm:inline font-medium">
            Welcome, {user.displayName ?? user?.email}
          </span>

          <Link
            to="/my-post"
            className="text-sm sm:text-base font-medium text-gray-800 border border-black px-2 sm:px-3 py-1 rounded hover:bg-black hover:text-white transition-all"
          >
            My Posts
          </Link>

          <Link
            to="/saved-post"
            className="text-sm sm:text-base font-medium text-gray-800 border border-black px-2 sm:px-3 py-1 rounded hover:bg-black hover:text-white transition-all"
          >
            Saved Posts
          </Link>

          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="text-sm sm:text-base cursor-pointer text-white bg-black px-3 sm:px-4 py-1.5 rounded hover:bg-gray-800 transition-all"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link
            to="/login"
            className="text-sm sm:text-base font-bold text-gray-800 hover:text-blue-500"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="text-sm sm:text-base font-bold text-gray-800 hover:text-green-500"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppBar;
