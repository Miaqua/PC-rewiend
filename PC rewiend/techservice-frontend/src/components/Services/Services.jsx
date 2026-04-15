import React, { useEffect, useState } from 'react';
import ServiceCard from './ServiceCard';
import styles from './styles.module.css'; 
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://phppracticesecond-production.up.railway.app/api/services')
      .then(response => {
        setServices(response.data.data || []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Ошибка загрузки услуг:', error);
        setError('Не удалось загрузить услуги');
        setLoading(false);
      });
  }, []);

  return (
    <section id="services" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className={`fw-bold ${styles.sectionTitle} gradient-text`}>Наши услуги</h2>
          <p className="lead text-muted">Полный спектр услуг по ремонту и обслуживанию компьютерной техники</p>
        </div>

        {loading ? (
          <div className="text-center">Загрузка...</div>
        ) : error ? (
          <div className="text-danger text-center">{error}</div>
        ) : (
          <div className="row g-4">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                id={service.id}
                images={service.images || []}  
                title={service.title}
                description={service.description}
              />

            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
