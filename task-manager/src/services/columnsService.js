import api from './apiService';

export const getColumns = async (boardId) => {
    const res = await api.get(`/columns/${boardId}`);
    return res.data;
};

export const addColumn = async (boardId, name) => {
    const res = await api.post(`/columns/${boardId}`, { name });
    return res.data;
};

export const updateColumn = async (boardId, columnId, name) => {
    const res = await api.put(`/columns/${boardId}/${columnId}`, { name });
    return res.data;
};

export const deleteColumn = async (boardId, columnId) => {
    const res = await api.delete(`/columns/${boardId}/${columnId}`);
    return res.data;
};
