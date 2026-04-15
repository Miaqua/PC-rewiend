import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaLaptopCode,
  FaSignInAlt,
  FaUserPlus,
  FaUserCircle,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import styles from './styles.module.css';
import { useAuth } from '../../../pages/Auth/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleNavScroll = (targetId) => {
    if (location.pathname === '/') {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: targetId } });
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark sticky-top ${styles.navbar}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <FaLaptopCode className="me-2" />TechService
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Главная</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavScroll('services')}>Услуги</button>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/news">Новости</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reviews">Отзывы</Link>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavScroll('about')}>О нас</button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={() => handleNavScroll('contacts')}>Контакты</button>
            </li>

            {/* Показываем админ-панель только если роль пользователя 'admin' */}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Админ-панель</Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <FaSignInAlt className="me-1" />Вход
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <FaUserPlus className="me-1" />Регистрация
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/account">
                  <FaUserCircle className="me-1" />
                  {user?.firstname ? user.firstname : 'Личный кабинет'}
                </Link>
              </li>
            )}

            <li className="nav-item ms-2">
              <span
                className={`theme-switcher ${styles.themeSwitcher}`}
                onClick={toggleTheme}
                role="button"
                tabIndex="0"
              >
                {darkMode ? (
                  <>
                    <FaSun className="me-1" /> Светлая тема
                  </>
                ) : (
                  <>
                    <FaMoon className="me-1" /> Темная тема
                  </>
                )}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
