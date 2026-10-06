import { useEffect, useState } from 'react';
import { Film, Users, Eye, Trash2, Shield, RefreshCw } from 'lucide-react';
import { fetchVideos, deleteVideo } from '../../services/videoService';
import { useToast } from '../../context/ToastContext';

const AdminDashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const videoData = await fetchVideos();
      setVideos(videoData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showToast('Failed to load platform statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeleteVideo = async (id) => {
    if (window.confirm('Admin Action: Delete this video permanently?')) {
      try {
        await deleteVideo(id);
        setVideos(videos.filter((v) => v._id !== id));
        showToast('Video deleted successfully', 'success');
      } catch (err) {
        showToast('Failed to delete video', 'error');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading admin statistics...</div>;
  }

  const totalViews = videos.reduce((acc, curr) => acc + (curr.views || 0), 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Management Dashboard</h1>
        <button
          onClick={loadDashboardData}
          className="p-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-600 rounded-2xl">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Videos</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{videos.length}</h3>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 rounded-2xl">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Platform Views</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{totalViews}</h3>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Active Creator Channels</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {new Set(videos.map((v) => v.uploader?._id)).size}
            </h3>
          </div>
        </div>
      </div>

      {/* Video Content Oversight Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Platform Content Oversight</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 text-[11px] font-semibold text-gray-400 uppercase">
                <th className="p-4 pl-6">Video</th>
                <th className="p-4">Uploader</th>
                <th className="p-4">Source</th>
                <th className="p-4">Views</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 text-xs">
              {videos.map((video) => (
                <tr key={video._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                  <td className="p-4 pl-6 flex items-center gap-3">
                    <img src={video.thumbnailUrl} alt="" className="w-12 h-8 rounded-lg object-cover" />
                    <span className="font-semibold text-gray-900 dark:text-white line-clamp-1">{video.title}</span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{video.uploader?.username || 'Unknown'}</td>
                  <td className="p-4 uppercase text-[10px] font-bold text-red-500">{video.sourceType}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{video.views}</td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;