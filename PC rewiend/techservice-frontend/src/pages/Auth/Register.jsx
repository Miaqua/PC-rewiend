import React, { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useEffect } from 'react';

export default function Register() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: 'user'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated) {
        navigate('/account');
      }
    }, [isAuthenticated]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.passwordConfirm) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    const { passwordConfirm, ...requestData } = formData;

    try {
      const response = await fetch('https://phppracticesecond-production.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);
        } else {
          setError(data.message || 'Ошибка регистрации');
        }
        setLoading(false);
        return;
      }

      setSuccess('Регистрация успешна! Перенаправляем в личный кабинет...');
      
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: '',
        passwordConfirm: '',
        role: 'user'
      });

      if (data.data && data.data.token) {
        login(data.data.token);
        setTimeout(() => navigate('/account'), 2000);
      }
    } catch (err) {
      setError('Ошибка сети или сервера');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '450px' }}>
      <h2 className="mb-4 text-center">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstname" className="form-label">Имя</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            className="form-control"
            placeholder="Имя"
            value={formData.firstname}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastname" className="form-label">Фамилия</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            className="form-control"
            placeholder="Фамилия"
            value={formData.lastname}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Телефон</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="form-control"
            placeholder="Телефон"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            className="form-control"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="8"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="passwordConfirm" className="form-label">Подтвердите пароль</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            className="form-control"
            placeholder="Подтвердите пароль"
            value={formData.passwordConfirm}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="8"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Регистрация...
            </>
          ) : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}