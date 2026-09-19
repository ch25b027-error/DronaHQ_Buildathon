import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './components/header';
import Footer from './components/footer';
import Dashnboard from './components/dashnboard';
import Login from './components/login'; // You will create this next
import './App.css';

// 1. Define the Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  // Check if the JWT token exists in the cookies
  const token = Cookies.get('sdr_token');
  
  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  // Token exists, render the protected component
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <>
                <Header />
                <Dashnboard />
                <Footer />
              </>
            </ProtectedRoute>
          } 
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
