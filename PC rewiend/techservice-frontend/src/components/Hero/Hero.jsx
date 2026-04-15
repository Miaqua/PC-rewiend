import React from 'react';
import styles from './styles.module.css';

const Hero = () => {
  return (
    <section className={`${styles.heroSection} hero-section`}>
      <div className="container text-center position-relative">
        <h1 className="display-4 fw-bold mb-4">Профессиональный ремонт компьютеров</h1>
        <p className="lead mb-5">Быстро, качественно, с гарантией. Оставьте заявку и получите скидку 10% на первый ремонт!</p>
        <div className="d-flex justify-content-center gap-3">
          <a href="#quick-order" className="btn btn-light btn-lg px-4">
            <i className="fas fa-tools me-2"></i>Заказать ремонт
          </a>
          <a href="tel:+71234567890" className="btn btn-outline-light btn-lg px-4">
            <i className="fas fa-phone-alt me-2"></i>+7 (123) 456-78-90
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;