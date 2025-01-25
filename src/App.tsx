import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./hooks/useAuth";
import AppBar from "./components/Nav";
import SavedPosts from "./components/SavedPosts";
import MyPosts from "./components/MyPosts";
import { auth } from "./firebase/firebase-config";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const user = auth.currentUser?.uid;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const UnprotectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <AppBar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/saved-post"
            element={
              <ProtectedRoute>
                <SavedPosts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-post"
            element={
              <ProtectedRoute>
                <MyPosts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <UnprotectedRoute>
                <LoginPage />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <UnprotectedRoute>
                <RegisterPage />
              </UnprotectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
