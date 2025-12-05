import api from './client';

export const getTasks = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/tasks?${params}`);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};

export const updateTask = async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
};

export const parseVoiceInput = async (transcript) => {
    const response = await api.post('/parse-voice', { transcript });
    return response.data;
};
