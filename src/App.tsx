import React, { useEffect, useState } from 'react';
import {   
  BrowserRouter as Router,   
  Route,   
  Routes,   
  Navigate, 
  useLocation 
} from "react-router-dom"; 
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "./firebase/firebase-config";

// Components and Pages
import Home from "./pages/Home"; 
import LoginPage from "./pages/LoginPage"; 
import RegisterPage from "./pages/RegisterPage"; 
import SavedPosts from "./components/SavedPosts"; 
import MyPosts from "./components/MyPosts"; 
import NotFound from "./components/NotFound";
import { ToastContainer } from "react-toastify";
import AppBar from "./components/Nav";

const UnprotectedRoute = ({ children }: { children: React.ReactNode }) => {   
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (isAuthenticated) {     
    return <Navigate to="/" replace />;   
  }    

  return <>{children}</>;
};  

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {   
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {     
    return <Navigate to="/login" state={{ from: location }} replace />;   
  }    

  return <>{children}</>;
};  

const App = () => {
  return (     
    <Router>       
      <ToastContainer />       
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
        <Route path="*" element={<NotFound />} />           
      </Routes>     
    </Router>   
  ); 
};  

export default App;