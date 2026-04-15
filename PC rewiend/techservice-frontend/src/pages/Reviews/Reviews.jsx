import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthContext';

const Reviews = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newEstimation, setNewEstimation] = useState(5);
  const [newDescription, setNewDescription] = useState('');
  const [newRequestId, setNewRequestId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const [reviewsRes, requestsRes] = await Promise.all([
          axios.get('https://phppracticesecond-production.up.railway.app/api/user/reviews', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://phppracticesecond-production.up.railway.app/api/user/requests', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setReviews(reviewsRes.data.data);
        setRequests(requestsRes.data.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setErrorMsg('Ошибка загрузки данных. Попробуйте обновить страницу.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newDescription.trim() === '') {
      setErrorMsg('Описание отзыва не может быть пустым.');
      return;
    }

    if (!newRequestId.trim()) {
      setErrorMsg('Пожалуйста, выберите заявку.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        'https://phppracticesecond-production.up.railway.app/api/user/reviews',
        {
          estimation: newEstimation,
          description: newDescription,
          request_id: Number(newRequestId), // Передаём число
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log('Ответ сервера при добавлении отзыва:', response.data);

      // Обновляем список отзывов после успешного добавления
      const refreshed = await axios.get(
        'https://phppracticesecond-production.up.railway.app/api/user/reviews',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(refreshed.data.data);

      // Сбрасываем форму
      setNewEstimation(5);
      setNewDescription('');
      setNewRequestId('');
    } catch (error) {
      console.error('Ошибка при добавлении отзыва:', error.response?.data || error.message);
      setErrorMsg('Не удалось добавить отзыв. Попробуйте позже.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <p>Пожалуйста, войдите в систему, чтобы просматривать и добавлять отзывы.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mt-5">
        <p>Загрузка отзывов...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Мои отзывы</h2>

      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <label htmlFor="requestId" className="form-label">Выберите заявку:</label>
          <select
            id="requestId"
            className="form-select"
            value={newRequestId}
            onChange={(e) => setNewRequestId(e.target.value)}
            disabled={submitting}
          >
            <option value="">-- Выберите заявку --</option>
            {requests.map((req) => (
              <option key={req.id} value={req.id}>
                {req.id} — {req.service?.name || 'Без названия услуги'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="estimation" className="form-label">Оценка:</label>
          <select
            id="estimation"
            className="form-select"
            value={newEstimation}
            onChange={(e) => setNewEstimation(Number(e.target.value))}
            disabled={submitting}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num} ⭐
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Отзыв:</label>
          <textarea
            id="description"
            className="form-control"
            rows="3"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            disabled={submitting}
          />
        </div>

        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Отправка...' : 'Добавить отзыв'}
        </button>
      </form>

      {reviews.length === 0 ? (
        <p>У вас пока нет отзывов.</p>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div className="col-md-6 mb-4" key={review.id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Оценка: {review.estimation} ⭐</h5>
                  <p className="card-text">{review.description}</p>
                  <p className="text-muted">Статус: {review.status}</p>
                  <p className="text-muted">Дата: {new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
