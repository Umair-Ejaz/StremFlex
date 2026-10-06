import API from './api';

export const fetchAdminVideos = async () => {
  const { data } = await API.get('/admin/videos');
  return data;
};

export const fetchAdminUsers = async () => {
  const { data } = await API.get('/admin/users');
  return data;
};

export const forceDeleteVideo = async (id) => {
  const { data } = await API.delete(`/admin/videos/${id}`);
  return data;
};