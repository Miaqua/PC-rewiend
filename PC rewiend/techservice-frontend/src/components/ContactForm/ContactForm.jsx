import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../pages/Auth/AuthContext';

const ContactForm = () => {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [errorServices, setErrorServices] = useState(null);

  // Поля формы
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    axios.get('https://phppracticesecond-production.up.railway.app/api/services')
      .then(response => {
        setServices(response.data.data || []);
        setLoadingServices(false);
      })
      .catch(error => {
        setErrorServices('Ошибка загрузки услуг');
        setLoadingServices(false);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!token) {
      setSubmitError('Пожалуйста, войдите в систему для отправки заявки.');
      return;
    }

    if (!serviceId) {
      setSubmitError('Пожалуйста, выберите услугу.');
      return;
    }

    setSubmitting(true);

    try {
      // Отправляем заявку на бэкенд
      await axios.post('https://phppracticesecond-production.up.railway.app/api/user/requests', {
        title: name || 'Новая заявка',
        description: message,
        service_id: serviceId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmitSuccess('Заявка успешно отправлена!');
      // Очистить форму
      setName('');
      setPhone('');
      setServiceId('');
      setMessage('');
    } catch (error) {
      setSubmitError('Ошибка при отправке заявки.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="quick-order" className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 gradient-text">Оставить заявку</h2>

                {loadingServices ? (
                  <p>Загрузка услуг...</p>
                ) : errorServices ? (
                  <p className="text-danger">{errorServices}</p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="name" className="form-label">Ваше имя</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">Телефон</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="service" className="form-label">Услуга</label>
                      <select
                        className="form-select"
                        id="service"
                        value={serviceId}
                        onChange={e => setServiceId(e.target.value)}
                        required
                      >
                        <option value="" disabled>Выберите услугу</option>
                        {services.map(service => (
                          <option key={service.id} value={service.id}>{service.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Опишите проблему</label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="3"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                      />
                    </div>

                    {submitError && <p className="text-danger">{submitError}</p>}
                    {submitSuccess && <p className="text-success">{submitSuccess}</p>}

                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-lg px-4" disabled={submitting}>
                        {submitting ? 'Отправка...' : 'Отправить заявку'}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
