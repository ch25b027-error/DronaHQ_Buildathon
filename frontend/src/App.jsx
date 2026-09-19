import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './components/header';
import Footer from './components/footer';
import Dashnboard from './components/dashnboard';
import Login from './components/login';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('sdr_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex flex-col bg-[#0B1519]">
                <Header />
                
                <main className="grow">
                  <Dashnboard />
                </main>
                
                <Footer />
              </div>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
