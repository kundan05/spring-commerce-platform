import api from '../../services/api';

export const authApi = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};
