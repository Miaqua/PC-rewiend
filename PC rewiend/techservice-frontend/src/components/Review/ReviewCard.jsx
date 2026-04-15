import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const ReviewCard = ({ author, rating, text, createdAt }) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <i key={i} className={`fas fa-star${i < rating ? '' : '-half-alt text-muted'}`}></i>
  ));

  return (
    <div className="review-card mb-4 p-4 shadow rounded bg-white">
      <div className="d-flex align-items-center mb-2">
        <div className="me-3">
          <img
            src={`https://via.placeholder.com/50/8b5cf6/ffffff?text=${author?.charAt(0) || 'U'}`}
            alt="Аватар"
            className="rounded-circle"
          />
        </div>
        <div>
          <h5 className="mb-0">{author || 'Пользователь'}</h5>
          <small className="text-muted">{format(new Date(createdAt), 'd MMMM yyyy', { locale: ru })}</small>
        </div>
      </div>
      <div className="review-rating text-warning mb-2">{stars}</div>
      <p>{text}</p>
    </div>
  );
};

export default ReviewCard;
