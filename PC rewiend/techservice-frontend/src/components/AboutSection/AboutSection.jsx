import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="py-5 gradient-bg text-white">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h2 className="fw-bold mb-3">О нашей компании</h2>
            <p className="lead mb-4">
              TechService - это команда профессионалов с более чем 10-летним опытом работы в сфере ремонта компьютерной техники.
            </p>
            <p>
              Мы используем только оригинальные комплектующие и современное оборудование для диагностики и ремонта. На все работы предоставляется гарантия до 2 лет.
            </p>
            <div className="d-flex mt-4">
              <div className="me-4">
                <div className="fs-1 fw-bold">10+</div>
                <div>Лет опыта</div>
              </div>
              <div className="me-4">
                <div className="fs-1 fw-bold">5K+</div>
                <div>Довольных клиентов</div>
              </div>
              <div>
                <div className="fs-1 fw-bold">24/7</div>
                <div>Поддержка</div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <img 
              src="https://via.placeholder.com/600x400/6d28d9/ffffff?text=TechService" 
              alt="О компании" 
              className="img-fluid rounded-3 shadow-lg" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
