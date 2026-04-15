import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import styles from './AdminPanel.css';

const AdminPanel = () => {
  // Состояния для данных
  const [news, setNews] = useState([]);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newsCategories, setNewsCategories] = useState([]);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [counts, setCounts] = useState({ news: 0, services: 0, reviews: 0, users: 0, workers: 0, contacts: 0, requests: 0, newsCategories: 0, serviceCategories: 0 });

  // Состояния для форм
  const [newNews, setNewNews] = useState({ title: "", description: "", category_id: "", images: [] });
  const [newService, setNewService] = useState({ title: "", description: "", price: "", category_id: "", images: [] });
  const [newWorker, setNewWorker] = useState({ firstname: "", lastname: "", age: "", description: "", images: [] });
  const [newContact, setNewContact] = useState({ address: "", phone: "", email: "", work_time: "" });
  const [newNewsCategory, setNewNewsCategory] = useState({ title: "", description: "" });
  const [newServiceCategory, setNewServiceCategory] = useState({ title: "", description: "" });
  const [editNews, setEditNews] = useState(null);
  const [editService, setEditService] = useState(null);
  const [editWorker, setEditWorker] = useState(null);
  const [editContact, setEditContact] = useState(null);
  const [editNewsCategory, setEditNewsCategory] = useState(null);
  const [editServiceCategory, setEditServiceCategory] = useState(null);
  const [reviewStatus, setReviewStatus] = useState({ id: "", status: "pending" });
  const [requestStatus, setRequestStatus] = useState({ id: "", status: "new" });
  const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибок

  // Состояния для модальных окон
  const [showModal, setShowModal] = useState({ type: "", isOpen: false });
  const [showDeleteModal, setShowDeleteModal] = useState({ type: "", id: null, isOpen: false });

  // Заголовки для авторизации
  const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

  // Получение данных
  const fetchAll = async () => {
    try {
      const [
        newsRes, servicesRes, workersRes, contactsRes, reviewsRes, requestsRes,
        newsCatRes, serviceCatRes, usersRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/news`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/services`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/workers`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/contacts`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/reviews`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/requests`, { headers }),
        axios.get(`${API_BASE_URL}/api/news-categories`, { headers }),
        axios.get(`${API_BASE_URL}/api/service-categories`, { headers }),
        axios.get(`${API_BASE_URL}/api/admin/users`, { headers }),
      ]);

      // Нормализация contacts: если data не массив, преобразуем в массив
      const contactsData = contactsRes.data.data;
      const normalizedContacts = Array.isArray(contactsData) ? contactsData : contactsData ? [contactsData] : [];

      // Устанавливаем данные, проверяя, что это массивы
      setNews(Array.isArray(newsRes.data.data) ? newsRes.data.data : []);
      setServices(Array.isArray(servicesRes.data.data) ? servicesRes.data.data : []);
      setWorkers(Array.isArray(workersRes.data.data) ? workersRes.data.data : []);
      setContacts(normalizedContacts);
      setReviews(Array.isArray(reviewsRes.data.data) ? reviewsRes.data.data : []);
      setRequests(Array.isArray(requestsRes.data.data) ? requestsRes.data.data : []);
      setNewsCategories(Array.isArray(newsCatRes.data.data) ? newsCatRes.data.data : []);
      setServiceCategories(Array.isArray(serviceCatRes.data.data) ? serviceCatRes.data.data : []);
      setCounts({
        news: Array.isArray(newsRes.data.data) ? newsRes.data.data.length : 0,
        services: Array.isArray(servicesRes.data.data) ? servicesRes.data.data.length : 0,
        reviews: Array.isArray(reviewsRes.data.data) ? reviewsRes.data.data.length : 0,
        users: Array.isArray(usersRes.data.data) ? usersRes.data.data.length : 0,
        workers: Array.isArray(workersRes.data.data) ? workersRes.data.data.length : 0,
        contacts: normalizedContacts.length,
        requests: Array.isArray(requestsRes.data.data) ? requestsRes.data.data.length : 0,
        newsCategories: Array.isArray(newsCatRes.data.data) ? newsCatRes.data.data.length : 0,
        serviceCategories: Array.isArray(serviceCatRes.data.data) ? serviceCatRes.data.data.length : 0,
      });
    } catch (error) {
      console.error("Ошибка получения данных:", error);
      setNews([]);
      setServices([]);
      setWorkers([]);
      setContacts([]);
      setReviews([]);
      setRequests([]);
      setNewsCategories([]);
      setServiceCategories([]);
      setCounts({ news: 0, services: 0, reviews: 0, users: 0, workers: 0, contacts: 0, requests: 0, newsCategories: 0, serviceCategories: 0 });
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Обработчики ввода
  const handleInputChange = (e, setState, state) => {
    const { name, value, files } = e.target;
    setState({ ...state, [name]: files ? Array.from(files) : value });
  };

  // Обработчики создания/обновления
  const handleSubmit = async (e, endpoint, data, isUpdate = false, id = null) => {
    e.preventDefault();
    setErrorMessage(""); // Сбрасываем сообщение об ошибке

    // Используем FormData для всех запросов
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value) && value.length) {
        value.forEach((file, i) => formData.append(`images[${i}]`, file));
      } else if (key !== "images") {
        formData.append(key, value || ""); // Пустые значения отправляем как пустые строки
      }
    });
    if (isUpdate) formData.append("_method", "PATCH");

    // Логируем содержимое FormData для диагностики
    console.log("FormData entries:", [...formData.entries()]);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/admin/${endpoint}${isUpdate ? `/${id}` : ""}`,
        formData,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );
      console.log("Response:", response.data);
      fetchAll();
      setShowModal({ type: "", isOpen: false });
      resetForms();
    } catch (error) {
      console.error(`Ошибка ${isUpdate ? "обновления" : "создания"}:`, error);
      if (error.response?.data?.errors) {
        setErrorMessage(Object.values(error.response.data.errors).flat().join(", "));
      } else {
        setErrorMessage(`Ошибка: ${error.message}`);
      }
    }
  };

  // Обработчик удаления
  const handleDelete = async (endpoint, id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/${endpoint}/${id}`, { headers });
      fetchAll();
      setShowDeleteModal({ type: "", id: null, isOpen: false });
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  // Обработчики статуса
  const handleStatusChange = async (endpoint, id, status) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/admin/${endpoint}/${id}/status`,
        { status },
        { headers }
      );
      fetchAll();
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  };

  // Сброс форм
  const resetForms = () => {
    setNewNews({ title: "", description: "", category_id: "", images: [] });
    setNewService({ title: "", description: "", price: "", category_id: "", images: [] });
    setNewWorker({ firstname: "", lastname: "", age: "", description: "", images: [] });
    setNewContact({ address: "", phone: "", email: "", work_time: "" });
    setNewNewsCategory({ title: "", description: "" });
    setNewServiceCategory({ title: "", description: "" });
    setEditNews(null);
    setEditService(null);
    setEditWorker(null);
    setEditContact(null);
    setEditNewsCategory(null);
    setEditServiceCategory(null);
    setReviewStatus({ id: "", status: "pending" });
    setRequestStatus({ id: "", status: "new" });
    setErrorMessage("");
  };

  // Открытие модального окна для редактирования
  const openEditModal = (type, item) => {
    if (type === "news") setEditNews(item);
    if (type === "services") setEditService(item);
    if (type === "workers") setEditWorker(item);
    if (type === "contacts") setEditContact(item);
    if (type === "news-categories") setEditNewsCategory(item);
    if (type === "service-categories") setEditServiceCategory(item);
    setShowModal({ type, isOpen: true });
  };

  // Компонент таблицы
  const renderTable = (type, items, fields) => {
    if (!Array.isArray(items)) {
      console.error(`Items for ${type} is not an array:`, items);
      return (
        <div className="bg-white p-6 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {type === "news" ? "Новости" : 
               type === "services" ? "Услуги" : 
               type === "workers" ? "Работники" : 
               type === "contacts" ? "Контакты" : 
               type === "news-categories" ? "Категории новостей" : 
               "Категории услуг"}
            </h2>
            <button
              onClick={() => setShowModal({ type, isOpen: true })}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Добавить
            </button>
          </div>
          <p className="text-red-600">Ошибка: данные не загружены или имеют неверный формат.</p>
        </div>
      );
    }

    return (
    
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {type === "news" ? "Новости" : 
             type === "services" ? "Услуги" : 
             type === "workers" ? "Работники" : 
             type === "contacts" ? "Контакты" : 
             type === "news-categories" ? "Категории новостей" : 
             "Категории услуг"}
          </h2>
          <button
            onClick={() => setShowModal({ type, isOpen: true })}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Добавить
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              {fields.map((field) => (
                <th key={field} className="p-2 text-left">{field}</th>
              ))}
              <th className="p-2 text-left">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={fields.length + 1} className="p-2 text-center">
                  Нет данных
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-t">
                  {fields.map((field) => (
                    <td key={field} className="p-2">
                      {field === "category" ? item.category?.title : 
                       field === "images" ? item.images?.length : 
                       item[field] || "-"}
                    </td>
                  ))}
                  <td className="p-2">
                    <button
                      onClick={() => openEditModal(type, item)}
                      className="text-blue-600 mr-2"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => setShowDeleteModal({ type, id: item.id, isOpen: true })}
                      className="text-red-600"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Статистика */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(counts).map(([key, value]) => (
          <div key={key} className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold">{value}</h3>
            <p>{key === "news" ? "Новости" : 
                key === "services" ? "Услуги" : 
                key === "reviews" ? "Отзывы" : 
                key === "users" ? "Пользователи" : 
                key === "workers" ? "Работники" : 
                key === "contacts" ? "Контакты" : 
                key === "requests" ? "Заявки" : 
                key === "newsCategories" ? "Категории новостей" : 
                "Категории услуг"}</p>
          </div>
        ))}
      </div>

      {/* Категории новостей */}
      {renderTable("news-categories", newsCategories, ["id", "title", "description", "created_at"])}

      {/* Категории услуг */}
      {renderTable("service-categories", serviceCategories, ["id", "title", "description", "created_at"])}

      {/* Новости */}
      {renderTable("news", news, ["id", "title", "description", "category", "images", "created_at"])}

      {/* Услуги */}
      {renderTable("services", services, ["id", "title", "description", "price", "category", "images", "created_at"])}

      {/* Работники */}
      {renderTable("workers", workers, ["id", "firstname", "lastname", "age", "description", "images", "created_at"])}

      {/* Контакты */}
      {renderTable("contacts", contacts, ["id", "address", "phone", "email", "work_time", "created_at"])}

      {/* Отзывы */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Отзывы</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="ID отзыва"
            className="border p-2 mr-2"
            value={reviewStatus.id}
            onChange={(e) => setReviewStatus({ ...reviewStatus, id: e.target.value })}
          />
          <select
            className="border p-2 mr-2"
            value={reviewStatus.status}
            onChange={(e) => setReviewStatus({ ...reviewStatus, status: e.target.value })}
          >
            <option value="pending">На модерации</option>
            <option value="approved">Одобрен</option>
            <option value="rejected">Отклонён</option>
          </select>
          <button
            onClick={() => handleStatusChange("reviews", reviewStatus.id, reviewStatus.status)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Обновить
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Описание</th>
              <th className="p-2 text-left">Оценка</th>
              <th className="p-2 text-left">Статус</th>
              <th className="p-2 text-left">Создано</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(reviews) && reviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  Нет данных
                </td>
              </tr>
            ) : Array.isArray(reviews) ? (
              reviews.map((review) => (
                <tr key={review.id} className="border-t">
                  <td className="p-2">{review.id}</td>
                  <td className="p-2">{review.description}</td>
                  <td className="p-2">{review.estimation}</td>
                  <td className="p-2">{review.status}</td>
                  <td className="p-2">{new Date(review.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center text-red-600">
                  Ошибка: данные отзывов не загружены или имеют неверный формат.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Заявки */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Заявки</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="ID заявки"
            className="border p-2 mr-2"
            value={requestStatus.id}
            onChange={(e) => setRequestStatus({ ...requestStatus, id: e.target.value })}
          />
          <select
            className="border p-2 mr-2"
            value={requestStatus.status}
            onChange={(e) => setRequestStatus({ ...requestStatus, status: e.target.value })}
          >
            <option value="new">Новая</option>
            <option value="in_progress">В обработке</option>
            <option value="completed">Завершена</option>
            <option value="cancelled">Отменена</option>
            <option value="rejected">Отклонена</option>
          </select>
          <button
            onClick={() => handleStatusChange("requests", requestStatus.id, requestStatus.status)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Обновить
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Название</th>
              <th className="p-2 text-left">Описание</th>
              <th className="p-2 text-left">Статус</th>
              <th className="p-2 text-left">Создано</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(requests) && requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-2 text-center">
                  Нет данных
                </td>
              </tr>
            ) : Array.isArray(requests) ? (
              requests.map((request) => (
                <tr key={request.id} className="border-t">
                  <td className="p-2">{request.id}</td>
                  <td className="p-2">{request.title}</td>
                  <td className="p-2">{request.description}</td>
                  <td className="p-2">{request.status}</td>
                  <td className="p-2">{new Date(request.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-2 text-center text-red-600">
                  Ошибка: данные заявок не загружены или имеют неверный формат.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно для создания/редактирования */}
      {showModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">
              {showModal.type === "news" ? (editNews ? "Редактировать новость" : "Добавить новость") :
               showModal.type === "services" ? (editService ? "Редактировать услугу" : "Добавить услугу") :
               showModal.type === "workers" ? (editWorker ? "Редактировать работника" : "Добавить работника") :
               showModal.type === "contacts" ? (editContact ? "Редактировать контакт" : "Добавить контакт") :
               showModal.type === "news-categories" ? (editNewsCategory ? "Редактировать категорию новостей" : "Добавить категорию новостей") :
               (editServiceCategory ? "Редактировать категорию услуг" : "Добавить категорию услуг")}
            </h2>
            {errorMessage && (
              <p className="text-red-600 mb-4">{errorMessage}</p>
            )}
            <form
              onSubmit={(e) => {
                const endpoint = showModal.type === "news-categories" ? "news-categories" : 
                                 showModal.type === "service-categories" ? "service-categories" : 
                                 showModal.type;
                const data = showModal.type === "news" ? (editNews || newNews) :
                             showModal.type === "services" ? (editService || newService) :
                             showModal.type === "workers" ? (editWorker || newWorker) :
                             showModal.type === "contacts" ? (editContact || newContact) :
                             showModal.type === "news-categories" ? (editNewsCategory || newNewsCategory) :
                             (editServiceCategory || newServiceCategory);
                const isUpdate = !!editNews || !!editService || !!editWorker || !!editContact || !!editNewsCategory || !!editServiceCategory;
                const id = editNews?.id || editService?.id || editWorker?.id || editContact?.id || editNewsCategory?.id || editServiceCategory?.id;
                handleSubmit(e, endpoint, data, isUpdate, id);
              }}
            >
              {showModal.type === "news" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Заголовок</label>
                    <input
                      type="text"
                      name="title"
                      value={editNews ? editNews.title : newNews.title}
                      onChange={(e) => handleInputChange(e, editNews ? setEditNews : setNewNews, editNews || newNews)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Описание</label>
                    <textarea
                      name="description"
                      value={editNews ? editNews.description : newNews.description}
                      onChange={(e) => handleInputChange(e, editNews ? setEditNews : setNewNews, editNews || newNews)}
                      className="w-full border rounded px-2 py-1"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Категория</label>
                    <select
                      name="category_id"
                      value={editNews ? editNews.category_id : newNews.category_id}
                      onChange={(e) => handleInputChange(e, editNews ? setEditNews : setNewNews, editNews || newNews)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      {newsCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Изображения</label>
                    <input
                      type="file"
                      name="images"
                      onChange={(e) => handleInputChange(e, editNews ? setEditNews : setNewNews, editNews || newNews)}
                      className="w-full border rounded px-2 py-1"
                      multiple
                      accept="image/*"
                    />
                  </div>
                </>
              )}
              {showModal.type === "services" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Название</label>
                    <input
                      type="text"
                      name="title"
                      value={editService ? editService.title : newService.title}
                      onChange={(e) => handleInputChange(e, editService ? setEditService : setNewService, editService || newService)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Описание</label>
                    <textarea
                      name="description"
                      value={editService ? editService.description : newService.description}
                      onChange={(e) => handleInputChange(e, editService ? setEditService : setNewService, editService || newService)}
                      className="w-full border rounded px-2 py-1"
                      rows="4"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Цена</label>
                    <input
                      type="number"
                      name="price"
                      value={editService ? editService.price : newService.price}
                      onChange={(e) => handleInputChange(e, editService ? setEditService : setNewService, editService || newService)}
                      className="w-full border rounded px-2 py-1"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Категория</label>
                    <select
                      name="category_id"
                      value={editService ? editService.category_id : newService.category_id}
                      onChange={(e) => handleInputChange(e, editService ? setEditService : setNewService, editService || newService)}
                      className="w-full border rounded px-2 py-1"
                      required
                    >
                      <option value="">Выберите категорию</option>
                      {serviceCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Изображения</label>
                    <input
                      type="file"
                      name="images"
                      onChange={(e) => handleInputChange(e, editService ? setEditService : setNewService, editService || newService)}
                      className="w-full border rounded px-2 py-1"
                      multiple
                      accept="image/*"
                    />
                  </div>
                </>
              )}
              {showModal.type === "workers" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Имя</label>
                    <input
                      type="text"
                      name="firstname"
                      value={editWorker ? editWorker.firstname : newWorker.firstname}
                      onChange={(e) => handleInputChange(e, editWorker ? setEditWorker : setNewWorker, editWorker || newWorker)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Фамилия</label>
                    <input
                      type="text"
                      name="lastname"
                      value={editWorker ? editWorker.lastname : newWorker.lastname}
                      onChange={(e) => handleInputChange(e, editWorker ? setEditWorker : setNewWorker, editWorker || newWorker)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Возраст</label>
                    <input
                      type="number"
                      name="age"
                      value={editWorker ? editWorker.age : newWorker.age}
                      onChange={(e) => handleInputChange(e, editWorker ? setEditWorker : setNewWorker, editWorker || newWorker)}
                      className="w-full border rounded px-2 py-1"
                      required
                      min="18"
                      max="100"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Описание</label>
                    <textarea
                      name="description"
                      value={editWorker ? editWorker.description : newWorker.description}
                      onChange={(e) => handleInputChange(e, editWorker ? setEditWorker : setNewWorker, editWorker || newWorker)}
                      className="w-full border rounded px-2 py-1"
                      rows="4"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Изображения</label>
                    <input
                      type="file"
                      name="images"
                      onChange={(e) => handleInputChange(e, editWorker ? setEditWorker : setNewWorker, editWorker || newWorker)}
                      className="w-full border rounded px-2 py-1"
                      multiple
                      accept="image/*"
                    />
                  </div>
                </>
              )}
              {showModal.type === "contacts" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Адрес</label>
                    <input
                      type="text"
                      name="address"
                      value={editContact ? editContact.address : newContact.address}
                      onChange={(e) => handleInputChange(e, editContact ? setEditContact : setNewContact, editContact || newContact)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Телефон</label>
                    <input
                      type="text"
                      name="phone"
                      value={editContact ? editContact.phone : newContact.phone}
                      onChange={(e) => handleInputChange(e, editContact ? setEditContact : setNewContact, editContact || newContact)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editContact ? editContact.email : newContact.email}
                      onChange={(e) => handleInputChange(e, editContact ? setEditContact : setNewContact, editContact || newContact)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Рабочее время</label>
                    <input
                      type="text"
                      name="work_time"
                      value={editContact ? editContact.work_time : newContact.work_time}
                      onChange={(e) => handleInputChange(e, editContact ? setEditContact : setNewContact, editContact || newContact)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </>
              )}
              {showModal.type === "news-categories" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Название</label>
                    <input
                      type="text"
                      name="title"
                      value={editNewsCategory ? editNewsCategory.title : newNewsCategory.title}
                      onChange={(e) => handleInputChange(e, editNewsCategory ? setEditNewsCategory : setNewNewsCategory, editNewsCategory || newNewsCategory)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Описание</label>
                    <textarea
                      name="description"
                      value={editNewsCategory ? editNewsCategory.description : newNewsCategory.description}
                      onChange={(e) => handleInputChange(e, editNewsCategory ? setEditNewsCategory : setNewNewsCategory, editNewsCategory || newNewsCategory)}
                      className="w-full border rounded px-2 py-1"
                      rows="4"
                    />
                  </div>
                </>
              )}
              {showModal.type === "service-categories" && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Название</label>
                    <input
                      type="text"
                      name="title"
                      value={editServiceCategory ? editServiceCategory.title : newServiceCategory.title}
                      onChange={(e) => handleInputChange(e, editServiceCategory ? setEditServiceCategory : setNewServiceCategory, editServiceCategory || newServiceCategory)}
                      className="w-full border rounded px-2 py-1"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Описание</label>
                    <textarea
                      name="description"
                      value={editServiceCategory ? editServiceCategory.description : newServiceCategory.description}
                      onChange={(e) => handleInputChange(e, editServiceCategory ? setEditServiceCategory : setNewServiceCategory, editServiceCategory || newServiceCategory)}
                      className="w-full border rounded px-2 py-1"
                      rows="4"
                    />
                  </div>
                </>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setShowModal({ type: "", isOpen: false }); resetForms(); }}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {editNews || editService || editWorker || editContact || editNewsCategory || editServiceCategory ? "Обновить" : "Добавить"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно для удаления */}
      {showDeleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Подтверждение</h2>
            <p className="mb-4">
              Удалить {showDeleteModal.type === "news" ? "новость" : 
                       showDeleteModal.type === "services" ? "услугу" : 
                       showDeleteModal.type === "workers" ? "работника" : 
                       showDeleteModal.type === "contacts" ? "контакт" : 
                       showDeleteModal.type === "news-categories" ? "категорию новостей" : 
                       "категорию услуг"}?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal({ type: "", id: null, isOpen: false })}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal.type, showDeleteModal.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;