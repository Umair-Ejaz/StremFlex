import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile, deleteAccount } from '../../services/authService';

const Profile = () => {
  const { user, loginUser, logoutUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = await updateProfile({ username, email, ...(password && { password }) });
      loginUser({ ...user, ...updatedData });
      alert('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: This will permanently delete your account and all associated videos!')) {
      try {
        await deleteAccount();
        logoutUser();
        navigate('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete account');
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 my-10 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Account Settings</h2>
      
      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Username</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-red-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-red-500" 
            required 
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">New Password (Optional)</label>
          <input 
            type="password" 
            placeholder="Leave blank to keep current" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-3 bg-gray-50 dark:bg-slate-800 rounded-xl text-sm dark:text-white border-none focus:ring-2 focus:ring-red-500" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
        >
          {loading ? 'Saving Changes...' : 'Update Profile'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-red-600 mb-2">Danger Zone</h3>
        <button 
          onClick={handleDeleteAccount} 
          className="w-full py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;