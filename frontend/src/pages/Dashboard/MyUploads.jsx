import { useEffect, useState } from 'react';
import { Trash2, Film, Edit3, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { fetchVideos, deleteVideo, updateVideo } from '../../services/videoService';

const MyUploads = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumbnailUrl, setEditThumbnailUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Define the async fetcher function directly inside useEffect
    const loadMyVideos = async () => {
      try {
        const data = await fetchVideos();
        // Filter videos uploaded by the logged-in user
        const userVideos = data.filter((v) => v.uploader?._id === user?._id);
        setMyVideos(userVideos);
      } catch (err) {
        console.error('Failed to load uploads:', err);
        showToast('Failed to load your uploads', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadMyVideos();
  }, [user?._id]); // Included dependency for safety

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        setMyVideos(myVideos.filter((v) => v._id !== id));
        showToast('Video deleted successfully!', 'success');
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message;
        showToast('Failed to delete video: ' + errMsg, 'error');
      }
    }
  };

  // Open Edit Modal
  const handleEditClick = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title || '');
    setEditDescription(video.description || '');
    setEditThumbnailUrl(video.thumbnailUrl || '');
  };

  // Submit Updated Video Data
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      setIsUpdating(true);
      const updatedData = {
        title: editTitle,
        description: editDescription,
        thumbnailUrl: editThumbnailUrl,
      };

      const res = await updateVideo(editingVideo._id, updatedData);

      setMyVideos(
        myVideos.map((v) => (v._id === editingVideo._id ? { ...v, ...updatedData } : v))
      );
      setEditingVideo(null);
      showToast('Video updated successfully!', 'success');
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message;
      showToast('Failed to update video: ' + errMsg, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your uploads...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Uploaded Videos</h1>

      {myVideos.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 text-center">
          <Film className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">You haven't uploaded any videos yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myVideos.map((video) => (
            <div key={video._id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 flex flex-col">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full aspect-video object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-red-500 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded">
                    {video.sourceType}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mt-2 line-clamp-1">{video.title}</h3>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-slate-800">
                  <span className="text-xs text-gray-400">{new Date(video.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(video)}
                      className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
                      title="Edit Video"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Video Details</h2>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={editThumbnailUrl}
                  onChange={(e) => setEditThumbnailUrl(e.target.value)}
                  className="w-full p-3 text-sm bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-slate-700 outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="w-1/2 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold text-xs rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-1/2 py-2.5 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyUploads;