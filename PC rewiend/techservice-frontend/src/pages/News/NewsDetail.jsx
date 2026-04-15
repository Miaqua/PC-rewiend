import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const res = await axios.get(`https://phppracticesecond-production.up.railway.app/api/news/${id}`);
        setNewsItem(res.data.data);
      } catch (e) {
        setError('Ошибка при загрузке новости');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) return <p>Загрузка новости...</p>;
  if (error) return <p>{error}</p>;
  if (!newsItem) return <p>Новость не найдена.</p>;

  return (
    <section className="container py-5">
      <Link to="/news" className="btn btn-outline-secondary mb-4">← Назад к новостям</Link>

      <h1>{newsItem.title}</h1>
      <div className="mb-3 text-muted">
        Категория: {newsItem.category?.title || 'Без категории'} | {new Date(newsItem.created_at).toLocaleDateString('ru-RU')}
      </div>

      {newsItem.images && newsItem.images.length > 0 && (
        <div className="mb-4">
          {newsItem.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${newsItem.title} - изображение ${idx + 1}`}
              className="img-fluid mb-2"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          ))}
        </div>
      )}

      <p>{newsItem.description}</p>
    </section>
  );
};

export default NewsDetail;
