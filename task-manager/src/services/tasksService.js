import api from './apiService';

export const addTask = async (boardId, columnId, title) => {
    const res = await api.post(`/tasks/${boardId}/${columnId}`, { title });
    return res.data;
};

export const updateTask = async (boardId, columnId, taskId, updatedData) => {
    const res = await api.put(`/tasks/${boardId}/${columnId}/${taskId}`, updatedData);
    return res.data;
};

export const deleteTask = async (boardId, columnId, taskId) => {
    const res = await api.delete(`/tasks/${boardId}/${columnId}/${taskId}`);
    return res.data;
};