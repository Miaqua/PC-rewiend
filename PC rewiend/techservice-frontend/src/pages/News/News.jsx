import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './News.module.css';

const News = ({ theme }) => {
  const [news, setNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все категории');
  const [selectedDateFilter, setSelectedDateFilter] = useState('За все время');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsRes = await axios.get('https://phppracticesecond-production.up.railway.app/api/news');
        setNews(newsRes.data.data || []);
        setPopularNews((newsRes.data.data || []).slice(0, 5));

        const catRes = await axios.get('https://phppracticesecond-production.up.railway.app/api/news-categories');
        setCategories(catRes.data.data || []);
        setLoading(false);
      } catch (e) {
        console.error('Ошибка при загрузке:', e);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch =
      (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Все категории' || item.category?.title === selectedCategory;

    const now = new Date();
    const newsDate = new Date(item.created_at);
    let matchesDate = true;

    return matchesSearch && matchesCategory && matchesDate;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Все категории');
  };

  if (loading) return <div className={styles.loading}>Загрузка новостей...</div>;

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.darkMode : ''}`}>
      <section className={styles.filterSection}>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="Все категории">Все категории</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.title}>
              {cat.title}
            </option>
          ))}
        </select>

        <select value={selectedDateFilter} onChange={(e) => setSelectedDateFilter(e.target.value)}>
          <option value="За все время">За все время</option>
          <option value="За последний месяц">За последний месяц</option>
          <option value="За последние 3 месяца">За последние 3 месяца</option>
          <option value="За последний год">За последний год</option>
        </select>

        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button onClick={resetFilters}>Сбросить</button>
      </section>

      <section className={styles.newsGrid}>
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <div key={item.id} className={styles.newsCard}>
              {item.images && item.images.length > 0 && (
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className={styles.newsImage}
                />
              )}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <small>
                {item.category?.title} •{' '}
                {new Date(item.created_at).toLocaleDateString('ru-RU')}
              </small>
            </div>
          ))
        ) : (
          <p>Новостей не найдено.</p>
        )}
      </section>
    </div>
  );
};

export default News;
