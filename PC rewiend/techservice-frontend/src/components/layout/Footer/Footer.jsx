import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import axios from 'axios';

const Footer = () => {
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  axios
    .get('https://phppracticesecond-production.up.railway.app/api/contacts')
    .then((response) => {
      console.log('Контакты из API:', response.data);
      if (response.data && response.data.data) {
        setContact(response.data.data); 
      }
    })
    .catch((error) => {
      console.error('Ошибка при загрузке контактов:', error);
    })
    .finally(() => setLoading(false));
  }, []);


  return (
    <footer className="py-4 bg-dark text-white">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>TechService</h5>
            <p>Профессиональный ремонт компьютеров и ноутбуков с гарантией качества.</p>
            <div className={styles.socialIcons}>
              <a href="#" className="text-white me-3"><i className="fab fa-vk fa-lg"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-telegram fa-lg"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-instagram fa-lg"></i></a>
              <a href="#" className="text-white"><i className="fab fa-youtube fa-lg"></i></a>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <h5>Меню</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Главная</a></li>
              <li><a href="#services" className="text-white">Услуги</a></li>
              <li><a href="#news" className="text-white">Новости</a></li>
              <li><a href="#about" className="text-white">О нас</a></li>
              <li><a href="#contacts" className="text-white">Контакты</a></li>
              <li><a href="/otz" className="text-white">Отзывы</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Контакты</h5>
            {loading ? (
              <p>Загрузка контактов...</p>
            ) : contact ? (
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="fas fa-map-marker-alt me-2"></i> {contact.address}
                </li>
                <li className="mb-2">
                  <i className="fas fa-phone-alt me-2"></i> {contact.phone}
                </li>
                <li className="mb-2">
                  <i className="fas fa-envelope me-2"></i> {contact.email}
                </li>
                <li>
                  <i className="fas fa-clock me-2"></i> {contact.work_time}
                </li>
              </ul>
            ) : (
              <p>Контакты не найдены.</p>
            )}

          </div>
        </div>
        <hr className="my-4 bg-light" />
        <div className="text-center">
          <p className="mb-0">&copy; 2023 TechService. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
