import { Video, Users } from 'lucide-react';

const AdminStatsCards = ({ videoCount, userCount }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
        <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl text-red-600">
          <Video className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Total Platform Videos</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{videoCount}</h3>
        </div>
      </div>
      <div className="flex items-center gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl text-indigo-600">
          <Users className="w-8 h-8" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Total Registered Users</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{userCount}</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCards;