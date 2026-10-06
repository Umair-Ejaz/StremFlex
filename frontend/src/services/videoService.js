import API from './api';

// 1. Fetch All Videos
export const fetchVideos = async () => {
  const { data } = await API.get('/videos');
  return data;
};

// 2. Fetch Single Video by ID
export const fetchVideoById = async (id) => {
  const { data } = await API.get(`/videos/${id}`);
  return data;
};

// 3. Upload New Video (FormData)
export const uploadVideoData = async (formData) => {
  const { data } = await API.post('/videos', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// 4. Update Video Details
export const updateVideo = async (id, videoData) => {
  const { data } = await API.put(`/videos/${id}`, videoData);
  return data;
};

// 5. Delete Video
export const deleteVideo = async (id) => {
  const { data } = await API.delete(`/videos/${id}`);
  return data;
};

// 6. Toggle Like on Video
export const toggleLike = async (id) => {
  const { data } = await API.post(`/videos/${id}/like`);
  return data;
};

// 7. Fetch Comments for a Video
export const fetchComments = async (videoId) => {
  const { data } = await API.get(`/videos/${videoId}/comments`);
  return data;
};

// 8. Create / Post a New Comment
export const createComment = async (videoId, text) => {
  const { data } = await API.post(`/videos/${videoId}/comments`, { text });
  return data;
};

// 9. Add Reply to a Comment
export const addReply = async (videoId, commentId, text) => {
  const { data } = await API.post(`/videos/${videoId}/comments/${commentId}/reply`, { text });
  return data;
};

// 10. Toggle Emoji Reaction on a Comment
export const toggleCommentReaction = async (videoId, commentId, emoji) => {
  const { data } = await API.post(`/videos/${videoId}/comments/${commentId}/react`, { emoji });
  return data;
};

export const videoService = {
  fetchVideos,
  fetchVideoById,
  uploadVideoData,
  updateVideo,
  deleteVideo,
  toggleLike,
  fetchComments,
  createComment,
  addReply,
  toggleCommentReaction,
};

export default videoService;