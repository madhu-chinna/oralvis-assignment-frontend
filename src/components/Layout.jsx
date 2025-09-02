import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  Upload, 
  Eye, 
  LogOut, 
  User,
  Shield,
  Menu,
  X,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Sparkles
} from 'lucide-react';

const Layout = () => {
  const { user, logout, isTechnician, isDentist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/dashboard', 
      icon: Home, 
      current: location.pathname === '/dashboard',
      description: 'Overview and analytics'
    },
    ...(isTechnician() ? [{ 
      name: 'Upload Scan', 
      href: '/upload', 
      icon: Upload, 
      current: location.pathname === '/upload',
      description: 'Add new patient scans'
    }] : []),
    ...(isDentist() ? [{ 
      name: 'View Scans', 
      href: '/scans', 
      icon: Eye, 
      current: location.pathname === '/scans',
      description: 'Browse and analyze scans'
    }] : []),
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'technician':
        return 'from-blue-500 to-cyan-500';
      case 'dentist':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'technician':
        return Upload;
      case 'dentist':
        return Eye;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon(user?.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-md shadow-2xl border-r border-white/20 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-200/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-glow">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2 w-2 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold text-gradient font-display">OralVis</span>
                <p className="text-xs text-slate-500 font-medium">Healthcare</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-slate-200/50">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${getRoleColor(user?.role)} rounded-xl flex items-center justify-center shadow-lg`}>
                <RoleIcon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 capitalize font-medium">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full nav-item group ${
                    item.current ? 'nav-item-active' : 'nav-item-inactive'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <div className="flex-1 text-left">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs opacity-75">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-slate-200/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group"
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform duration-200" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top navigation bar */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
            >
              <Menu className="h-6 w-6 text-slate-600" />
            </button>

            {/* Search bar (hidden on mobile) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search patients, scans..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className={`w-8 h-8 bg-gradient-to-r ${getRoleColor(user?.role)} rounded-lg flex items-center justify-center shadow-sm`}>
                    <RoleIcon className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors duration-200">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-slate-200 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Click outside to close user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-20"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
