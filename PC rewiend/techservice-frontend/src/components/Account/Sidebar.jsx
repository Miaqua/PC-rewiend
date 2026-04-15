import React from 'react';

const Sidebar = () => {
  return (
    <div className="sidebar bg-white p-3 shadow rounded">
      <div className="user-profile text-center mb-4">
        <img
          src="https://via.placeholder.com/100/8b5cf6/ffffff?text=User"
          alt="Аватар"
          className="rounded-circle mb-2"
        />
        <h5 className="mb-0">Иван Иванов</h5>
        <small className="text-muted">Участник с 15.06.2023</small>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <a className="nav-link active" href="#"><i className="fas fa-user me-2"></i>Профиль</a>
        </li>
        <li className="nav-item mb-2">
          <a className="nav-link" href="#"><i className="fas fa-tools me-2"></i>Мои заявки</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
