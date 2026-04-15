import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ServicePage.css';

const ServicePage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, servicesRes] = await Promise.all([
          axios.get(`https://phppracticesecond-production.up.railway.app/api/services/${id}`),
          axios.get('https://phppracticesecond-production.up.railway.app/api/services'),
        ]);

        setService(serviceRes.data.data);
        setRelatedServices(servicesRes.data.data?.filter(s => s.id !== Number(id)) || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <i className="fas fa-info-circle me-2"></i> Услуга не найдена
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid service-page pt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h3 className="card-title mb-3">
                <i className="fas fa-wrench me-2 text-primary"></i>
                {service.title}
              </h3>
              <p className="text-muted">{service.description || 'Описание отсутствует'}</p>
              <p><strong>Цена:</strong> <span className="text-success">{service.price} ₽</span></p>
              <p><strong>Категория:</strong> {service.category?.title || '-'}</p>

              {service.images && service.images.length > 0 && (
                <div className="service-images d-flex flex-wrap mt-4">
                  {service.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${service.title} ${idx + 1}`}
                      className="img-thumbnail me-2 mb-2"
                      style={{ maxWidth: '150px', borderRadius: '0.5rem' }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">
                <i className="fas fa-layer-group me-2 text-info"></i>Похожие услуги
              </h5>
              <ul className="list-group list-group-flush">
                {relatedServices.length > 0 ? (
                  relatedServices.map(rs => (
                    <li key={rs.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <Link to={`/services/${rs.id}`} className="text-decoration-none">
                        {rs.title}
                      </Link>
                      <i className="fas fa-chevron-right text-muted small" />
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">Похожие услуги отсутствуют</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
