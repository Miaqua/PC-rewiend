import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './SpecialistDetail.module.css'; // Создай свой CSS-модуль

const SpecialistDetail = () => {
  const { id } = useParams();
  const [specialist, setSpecialist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.body.classList.contains('dark-mode'));

    const observer = new MutationObserver(() => {
      setIsDark(document.body.classList.contains('dark-mode'));
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    axios
      .get(`https://phppracticesecond-production.up.railway.app/api/workers/${id}`)
      .then((res) => {
        setSpecialist(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке специалиста:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className={styles.loading}>Загрузка...</p>;
  if (!specialist) return <p className={styles.loading}>Специалист не найден.</p>;

  return (
    <section className={`${styles.wrapper} ${isDark ? styles.dark : ''}`}>
      <div className="container">
        <Link to="/#specialists" className={styles.backLink}>
          ← Назад к специалистам
        </Link>

        <div className={styles.detailCard}>
          <img
            src={
              specialist.images?.[0] ||
              `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 100)}.jpg`
            }
            alt={`${specialist.firstname} ${specialist.lastname}`}
            className={styles.avatar}
          />

          <div className={styles.info}>
            <h2 className={styles.name}>
              {specialist.firstname} {specialist.lastname}
            </h2>
            <p className={styles.position}>{specialist.position || 'Специалист по ремонту'}</p>

            <p className={styles.bio}>
              {specialist.description ||
                `Опыт работы: ${
                  specialist.experience || Math.floor(Math.random() * 10) + 1
                } лет. ${specialist.bio || 'Профессиональный мастер с опытом работы.'}`}
            </p>

            <div className={styles.skills}>
              {(specialist.skills || ['Диагностика', 'Ремонт', 'Настройка']).map((skill, i) => (
                <span key={i} className={styles.skillBadge}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialistDetail;
