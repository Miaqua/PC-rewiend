import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsSection = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('https://phppracticesecond-production.up.railway.app/api/news');
        setNews((res.data?.data || []).slice(0, 3)); // показываем только 3 новости
      } catch (error) {
        console.error('Ошибка при загрузке новостей:', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <section id="news" className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title gradient-text">Новости и акции</h2>
          <p className="lead text-muted">Будьте в курсе последних событий и выгодных предложений</p>
        </div>

        <div className="row g-4">
          {news.map((item) => (
            <div className="col-md-6 col-lg-4" key={item.id}>
              <div className="card news-card h-100">
                <img
                  src={item.images?.[0] || 'https://via.placeholder.com/400x225/cccccc/ffffff?text=Нет+изображения'}
                  className="card-img-top"
                  alt={item.title}
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="badge bg-primary">{item.category?.title || 'Без категории'}</span>
                    <small className="text-muted">
                      {new Date(item.created_at).toLocaleDateString('ru-RU')}
                    </small>
                  </div>
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <a href={`/news/${item.id}`} className="btn btn-sm btn-outline-primary">Подробнее</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <a href="/news" className="btn btn-primary btn-lg px-4">
            <i className="fas fa-newspaper me-2"></i>Все новости и акции
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
