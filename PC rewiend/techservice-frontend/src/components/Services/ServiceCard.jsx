import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ id, images, title, description }) => {
  const imageUrl = images && images.length > 0 ? images[0] : null;

  return (
    <div className="col-md-6 col-lg-3">
      <div className="card h-100 shadow-sm">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            className="card-img-top"
            style={{ objectFit: 'cover', height: '150px', width: '100%' }}
          />
        )}

        <div className="card-body text-center">
          <h4 className="gradient-text">{title}</h4>

          <p className="text-muted">{description}</p>

          <Link to={`/services/${id}`} className="btn btn-sm btn-outline-primary">
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
