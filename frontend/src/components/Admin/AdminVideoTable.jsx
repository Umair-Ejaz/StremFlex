import { Trash2 } from 'lucide-react';

const AdminVideoTable = ({ videos, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 dark:bg-slate-800/50 text-xs uppercase text-gray-500">
          <tr>
            <th className="p-4">Thumbnail</th>
            <th className="p-4">Title</th>
            <th className="p-4">Source</th>
            <th className="p-4">Uploader</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
          {videos.map((video) => (
            <tr key={video._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
              <td className="p-4">
                <img src={video.thumbnailUrl} alt={video.title} className="w-16 h-10 object-cover rounded-lg" />
              </td>
              <td className="p-4 font-medium text-gray-900 dark:text-white">{video.title}</td>
              <td className="p-4 uppercase text-xs font-semibold text-red-500">{video.sourceType}</td>
              <td className="p-4 text-gray-600 dark:text-gray-400">{video.uploader?.username || 'N/A'}</td>
              <td className="p-4">
                <button onClick={() => onDelete(video._id)} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminVideoTable;