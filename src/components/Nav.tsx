import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AppBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  console.log("user", user);
  return (
    <div className="p-4 flex justify-between items-center text-gray-800 shadow-lg">
      <div className="text-xl font-semibold">
        <Link to="/" className="hover:text-blue-500">
          Socify
        </Link>
      </div>

      {user ? (
        <div className="flex items-center space-x-4">
          <span className="mr-2 font-medium">
            Welcome, {user.displayName ?? user?.email}
          </span>
          <div className="flex items-center space-x-4">
            <Link
              to="/my-post"
              className="font-medium text-gray-800 border border-black px-3 py-1.5 rounded hover:bg-black hover:text-white   flex items-center space-x-1"
            >
              <span>My Posts</span>
            </Link>
            <Link
              to="/saved-post"
              className="font-medium text-gray-800 border border-black px-3 py-1.5 rounded   hover:bg-black hover:text-white  flex items-center space-x-1"
            >
              <span>Saved Posts</span>
            </Link>
          </div>

          <button
            onClick={async () => {
              await logout();
              navigate("/login");
            }}
            className="cursor-pointer text-white bg-black py-2 px-4 rounded-md hover:bg-gray-800 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="font-bold text-gray-800 hover:text-blue-500 flex items-center space-x-1"
          >
            <span>Login</span>
          </Link>
          <Link
            to="/register"
            className="font-bold text-gray-800 hover:text-green-500 flex items-center space-x-1"
          >
            <span>Register</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AppBar;
