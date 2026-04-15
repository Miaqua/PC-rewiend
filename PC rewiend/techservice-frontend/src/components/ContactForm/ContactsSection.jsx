import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContactsSection = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('https://phppracticesecond-production.up.railway.app/api/contacts')
      .then((response) => {
        if (response.data && response.data.data) {
          setContact(response.data.data);
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке контактов:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка контактов...</p>;
  if (!contact) return <p>Контакты не найдены.</p>;

  return (
    <section id="contacts" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title gradient-text">Контакты</h2>
          <p className="lead text-muted">Свяжитесь с нами удобным для вас способом</p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="icon-box rounded-circle p-3 mb-3 mx-auto">
                  <i className="fas fa-map-marker-alt fa-2x"></i>
                </div>
                <h4>Адрес</h4>
                <p className="text-muted">{contact.address}</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="icon-box rounded-circle p-3 mb-3 mx-auto">
                  <i className="fas fa-phone-alt fa-2x"></i>
                </div>
                <h4>Телефон</h4>
                <p className="text-muted">{contact.phone}</p>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, '')}`} className="btn btn-sm btn-primary">
                  Позвонить
                </a>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="icon-box rounded-circle p-3 mb-3 mx-auto">
                  <i className="fas fa-envelope fa-2x"></i>
                </div>
                <h4>Email</h4>
                <p className="text-muted">{contact.email}</p>
                <a href={`mailto:${contact.email}`} className="btn btn-sm btn-primary">
                  Написать
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
