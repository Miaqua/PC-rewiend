import React from 'react';

const MyRequests = () => {
  return (
    <div>
      <h4 className="gradient-text mb-4">Мои заявки</h4>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>№</th>
              <th>Устройство</th>
              <th>Проблема</th>
              <th>Статус</th>
              <th>Дата</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1254</td>
              <td>Ноутбук ASUS</td>
              <td>Не включается</td>
              <td><span className="badge bg-warning">В работе</span></td>
              <td>12.06.2023</td>
              <td><a href="#" className="btn btn-sm btn-outline-primary">Подробнее</a></td>
            </tr>
            <tr>
              <td>#1198</td>
              <td>ПК</td>
              <td>Чистка от пыли</td>
              <td><span className="badge bg-success">Завершено</span></td>
              <td>05.06.2023</td>
              <td><a href="#" className="btn btn-sm btn-outline-primary">Подробнее</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyRequests;
