import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Account.module.css';

const RequestRow = ({ request, onUpdate, services }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: request.title,
    description: request.description,
    service_id: request.service?.id || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `https://phppracticesecond-production.up.railway.app/api/user/requests/${request.id}`,
        {
          title: formData.title,
          description: formData.description,
          service_id: formData.service_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onUpdate(response.data.data);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 400) {
        alert('Заявка уже в процессе решения и не может быть изменена');
      } else if (error.response?.status === 422) {
        alert('Ошибка валидации: проверьте введённые данные');
      } else {
        alert('Ошибка при обновлении заявки');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      title: request.title,
      description: request.description,
      service_id: request.service?.id || '',
    });
  };

  return (
    <tr>
      <td>{request.id}</td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
          />
        ) : (
          request.title
        )}
      </td>
      <td>
        {isEditing ? (
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
          />
        ) : (
          request.description
        )}
      </td>
      <td>
        {isEditing ? (
          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Выберите услугу</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        ) : (
          request.service?.title || '—'
        )}
      </td>
      <td>
        <span
          className={`${styles.badge} ${
            request.status === 'completed'
              ? styles.badgeSuccess
              : request.status === 'in_progress'
              ? styles.badgeWarning
              : styles.badgeInfo
          }`}
        >
          {request.status === 'completed'
            ? 'Завершено'
            : request.status === 'in_progress'
            ? 'В работе'
            : 'В ожидании'}
        </span>
      </td>
      <td>{new Date(request.created_at).toLocaleDateString('ru-RU')}</td>
      <td>
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={loading}
              className={styles.saveButton}
            >
              Сохранить
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className={styles.cancelButton}
            >
              Отмена
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={styles.editButton}
          >
            Редактировать
          </button>
        )}
      </td>
    </tr>
  );
};

const Account = () => {
  const [userData, setUserData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    created_at: '',
  });

  const [activeRequests, setActiveRequests] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [userResponse, requestsResponse, servicesResponse] =
          await Promise.all([
            axios.get(
              'https://phppracticesecond-production.up.railway.app/api/user',
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              'https://phppracticesecond-production.up.railway.app/api/user/requests',
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
            axios.get(
              'https://phppracticesecond-production.up.railway.app/api/services',
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            ),
          ]);

        setUserData(userResponse.data.data);
        setActiveRequests(requestsResponse.data.data);
        setServices(servicesResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        'https://phppracticesecond-production.up.railway.app/api/user',
        {
          firstname: userData.firstname,
          lastname: userData.lastname,
          email: userData.email,
          phone: userData.phone,
          role: 'user', // добавляем роль по умолчанию
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      alert('Данные успешно обновлены!');
    } catch (error) {
      if (error.response) {
        console.error('Ошибка при обновлении данных:', error.response.data);
        alert(
          'Ошибка при обновлении данных:\n' +
          JSON.stringify(error.response.data, null, 2)
        );
      } else {
        console.error('Ошибка при обновлении данных:', error.message);
        alert('Произошла ошибка при обновлении данных');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordForm.new_password.length < 6) {
      alert('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      alert('Новые пароли не совпадают');
      return;
    }

    try {
      const response = await axios.patch(
        'https://phppracticesecond-production.up.railway.app/api/user/password',
        {
          oldPassword: passwordForm.current_password,
          newPassword: passwordForm.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      alert(response.data.message || 'Пароль успешно изменён');

      setPasswordForm({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 403) {
          alert('Неверный текущий пароль');
        } else if (status === 422) {
          alert('Ошибка валидации: проверьте введённые данные');
        } else if (status === 401) {
          alert('Вы не авторизованы');
        } else {
          alert(data.message || 'Произошла ошибка при смене пароля');
        }
      } else {
        alert('Ошибка сети или сервера');
      }
      console.error('Ошибка смены пароля:', error);
    }
  };

  const handleRequestUpdate = (updatedRequest) => {
    setActiveRequests((prev) =>
      prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req))
    );
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка данных...</div>;
  }

  return (
    <div className={styles.accountContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <FaUser size={40} />
          <h2>
            {userData.firstname} {userData.lastname}
          </h2>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Выйти <FaSignOutAlt />
          </button>
        </div>
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${
              activeTab === 'profile' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === 'requests' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('requests')}
          >
            Мои заявки
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === 'password' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('password')}
          >
            Сменить пароль
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        {activeTab === 'profile' && (
          <section>
            <h1>Профиль пользователя</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
              <label>
                Имя:
                <input
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Фамилия:
                <input
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Телефон:
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit" className={styles.saveButton}>
                Сохранить
              </button>
            </form>
          </section>
        )}

        {activeTab === 'requests' && (
          <section>
            <h1>Мои заявки</h1>
            {activeRequests.length === 0 ? (
              <p>Заявок пока нет.</p>
            ) : (
              <table className={styles.requestsTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Услуга</th>
                    <th>Статус</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRequests.map((request) => (
                    <RequestRow
                      key={request.id}
                      request={request}
                      onUpdate={handleRequestUpdate}
                      services={services}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === 'password' && (
          <section>
            <h1>Сменить пароль</h1>
            <form onSubmit={handlePasswordChange} className={styles.form}>
              <label>
                Текущий пароль:
                <input
                  type="password"
                  name="current_password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordInputChange}
                  required
                />
              </label>
              <label>
                Новый пароль:
                <input
                  type="password"
                  name="new_password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordInputChange}
                  required
                  minLength={6}
                />
              </label>
              <label>
                Подтверждение нового пароля:
                <input
                  type="password"
                  name="new_password_confirmation"
                  value={passwordForm.new_password_confirmation}
                  onChange={handlePasswordInputChange}
                  required
                  minLength={6}
                />
              </label>
              <button type="submit" className={styles.saveButton}>
                Изменить пароль
              </button>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default Account;
