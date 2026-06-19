import api from '../../services/api';

export const orderApi = {
    place: (data) => api.post('/orders', data),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
};
