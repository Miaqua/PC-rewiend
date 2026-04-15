import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer'; // <-- исправлено имя
import HomePage from './pages/Home/home';
import Login from './pages/Auth/Login';
import AdminPanel from './pages/Admin/AdminPanel';
import Register from './pages/Auth/Register';
import ServicePage from './pages/Services/ServicePage';
import News from './pages/News/News';
import NewsDetail from './pages/News/NewsDetail'; 
import SpecialistDetail from './pages/Specialist/SpecialistDetail';
import Reviews from './pages/Reviews/Reviews';
import { AuthProvider } from './pages/Auth/AuthContext';
import Account from './pages/Profile/Account';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Header />
          <main className="flex-grow-1 mb-5">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services/:id" element={<ServicePage />} />
              <Route path="/news" element={<News />} /> 
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/specialist/:id" element={<SpecialistDetail />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/account" element={<Account />} />

            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
