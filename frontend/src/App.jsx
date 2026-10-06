import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { SocketProvider } from './context/SocketContext';

import Navbar from './components/Common/Navbar';
import Sidebar from './components/Common/Sidebar';
import ProtectedRoute from './components/Common/ProtectedRoute';
import AdminRoute from './components/Common/AdminRoute';

import Explore from './pages/Dashboard/Explore';
import MyUploads from './pages/Dashboard/MyUploads';
import Profile from './pages/Dashboard/Profile';

import UploadVideo from './pages/UploadVideo';
import Watch from './pages/Watch';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import AdminDashboard from './pages/Admin/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  const [search, setSearch] = useState('');

  return (
    <BrowserRouter>
      <SocketProvider>
        <ToastProvider>
          <Navbar search={search} setSearch={setSearch} />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 min-h-[calc(100vh-65px)] bg-gray-50 dark:bg-slate-950">
              <Routes>
                <Route path="/" element={<Explore search={search} />} />
                <Route path="/watch/:id" element={<Watch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <UploadVideo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-uploads"
                  element={
                    <ProtectedRoute>
                      <MyUploads />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;