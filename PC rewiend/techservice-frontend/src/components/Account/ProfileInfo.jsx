import React from 'react';

const ProfileInfo = () => {
  return (
    <div>
      <h4 className="gradient-text mb-4">Мой профиль</h4>
      <form>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Имя</label>
            <input type="text" className="form-control" value="Иван" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Фамилия</label>
            <input type="text" className="form-control" value="Иванов" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value="ivan@example.com" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Телефон</label>
            <input type="tel" className="form-control" value="+7 (123) 456-78-90" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default ProfileInfo;
