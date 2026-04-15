import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Specialists = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Инициализируем тему сразу при монтировании
    setIsDark(document.body.classList.contains('dark-mode'));

    // Создаем MutationObserver для отслеживания изменений атрибутов body
    const observer = new MutationObserver(() => {
      const hasDark = document.body.classList.contains('dark-mode');
      setIsDark(hasDark);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Чистим наблюдателя при размонтировании
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    axios
      .get('https://phppracticesecond-production.up.railway.app/api/workers')
      .then((response) => {
        setWorkers(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка при получении данных специалистов:', error);
        setLoading(false);
      });
  }, []);

  const renderSkills = (skills) => {
    if (!skills) return null;
    return (
      <div className={styles.skills}>
        {skills.map((skill, index) => (
          <span key={index} className={styles.skillBadge}>
            {skill}
          </span>
        ))}
      </div>
    );
  };

  const handleCardClick = (id) => {
    navigate(`/specialist/${id}`);
  };

  return (
    <section
      id="specialists"
      className={`${styles.wrapper} ${isDark ? styles.dark : ''}`}
    >
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Команда профессионалов</h2>
          <p className={styles.subtitle}>
            Наши специалисты помогут решить любую проблему с вашей техникой
          </p>
        </div>

        {loading ? (
          <p className={styles.loading}>Загрузка специалистов...</p>
        ) : Array.isArray(workers) && workers.length > 0 ? (
          <div className={styles.cardGrid}>
            {workers.map((worker) => (
              <div
                key={worker.id}
                className={`${styles.card} ${isDark ? styles.darkCard : ''}`}
                onClick={() => handleCardClick(worker.id)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={
                    worker.images?.[0] ||
                    'https://randomuser.me/api/portraits/men/' +
                      (Math.floor(Math.random() * 100) + '.jpg')
                  }
                  alt={`${worker.firstname} ${worker.lastname}`}
                  className={styles.avatar}
                />
                <h3 className={styles.name}>
                  {worker.firstname} {worker.lastname}
                </h3>
                <p className={styles.position}>
                  {worker.position || 'Специалист по ремонту'}
                </p>

                <p className={styles.bio}>
                  {worker.description ||
                    `Опыт работы: ${
                      worker.experience || Math.floor(Math.random() * 10) + 1
                    } лет. ${
                      worker.bio ||
                      'Профессиональный мастер с многолетним опытом работы.'
                    }`}
                </p>

                {renderSkills(
                  worker.skills || ['Диагностика', 'Ремонт', 'Обслуживание', 'Настройка']
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.loading}>Специалисты не найдены.</p>
        )}
      </div>
    </section>
  );
};

export default Specialists;
