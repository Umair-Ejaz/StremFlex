import { NavLink } from 'react-router-dom';
import { Compass, Video, User, Shield, Upload } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  const links = [
    { name: 'Explore', path: '/', icon: Compass },
    ...(user ? [
      { name: 'Upload Video', path: '/upload', icon: Upload },
      { name: 'My Uploads', path: '/my-uploads', icon: Video },
      { name: 'Profile', path: '/profile', icon: User },
    ] : []),
    ...(user?.isAdmin ? [{ name: 'Admin Panel', path: '/admin', icon: Shield }] : [])
  ];

  return (
    <aside className="w-64 border-r border-gray-200 dark:border-slate-800 p-4 min-h-[calc(100vh-65px)] bg-white dark:bg-slate-900">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                    : 'text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;