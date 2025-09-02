import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { 
  Upload, 
  Eye, 
  Users, 
  Calendar,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BarChart3,
  FileText,
  Zap,
  Star,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const { user, isTechnician, isDentist } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    totalScans: 0,
    activePatients: 0,
    monthlyScans: 0,
    recentScans: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch data for both technicians and dentists
      if (isDentist()) {
        // Dentists can see all scans
        const response = await api.get('/scans');
        const scans = response.data.scans;
        
        // Calculate real statistics
        const totalScans = scans.length;
        const uniquePatients = new Set(scans.map(scan => scan.patientId)).size;
        
        // Calculate monthly scans (current month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyScans = scans.filter(scan => {
          const scanDate = new Date(scan.uploadDate);
          return scanDate.getMonth() === currentMonth && scanDate.getFullYear() === currentYear;
        }).length;

        // Get recent scans (last 5)
        const recentScans = scans
          .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
          .slice(0, 5);

        setDashboardData({
          totalScans,
          activePatients: uniquePatients,
          monthlyScans,
          recentScans
        });
      } else if (isTechnician()) {
        // Technicians can see all scans (they uploaded them)
        const response = await api.get('/scans');
        const scans = response.data.scans;
        
        // Calculate real statistics
        const totalScans = scans.length;
        const uniquePatients = new Set(scans.map(scan => scan.patientId)).size;
        
        // Calculate monthly scans (current month)
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyScans = scans.filter(scan => {
          const scanDate = new Date(scan.uploadDate);
          return scanDate.getMonth() === currentMonth && scanDate.getFullYear() === currentYear;
        }).length;

        // Get recent scans (last 5)
        const recentScans = scans
          .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
          .slice(0, 5);

        setDashboardData({
          totalScans,
          activePatients: uniquePatients,
          monthlyScans,
          recentScans
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Total Scans',
      value: dashboardData.totalScans.toString(),
      change: '+0%',
      changeType: 'positive',
      icon: Upload,
      color: 'from-blue-500 to-cyan-500',
      description: 'All time uploads'
    },
    {
      name: 'Active Patients',
      value: dashboardData.activePatients.toString(),
      change: '+0%',
      changeType: 'positive',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      description: 'Currently active'
    },
    {
      name: 'This Month',
      value: dashboardData.monthlyScans.toString(),
      change: '+0%',
      changeType: 'positive',
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      description: 'Monthly uploads'
    },
    {
      name: 'Success Rate',
      value: '100%',
      change: '+0%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
      description: 'Processing success'
    },
  ];

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const recentActivity = dashboardData.recentScans.map(scan => ({
    id: scan.id,
    type: 'scan_uploaded',
    patient: scan.patientName,
    patientId: scan.patientId,
    timestamp: getTimeAgo(scan.uploadDate),
    status: 'completed',
    icon: Upload,
    color: 'text-blue-600'
  }));

  const quickActions = [
    ...(isTechnician() ? [{
      title: 'Upload New Scan',
      description: 'Add a new patient scan with details',
      icon: Upload,
      color: 'from-blue-500 to-cyan-500',
      href: '/upload',
      action: 'Upload'
    }] : []),
    ...(isDentist() ? [{
      title: 'View All Scans',
      description: 'Browse and analyze patient scans',
      icon: Eye,
      color: 'from-emerald-500 to-teal-500',
      href: '/scans',
      action: 'View'
    }] : []),
    {
      title: 'Generate Report',
      description: 'Create comprehensive scan reports',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      href: '/reports',
      action: 'Generate'
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and insights',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      href: '/analytics',
      action: 'Analyze'
    }
  ];

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-soft">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {getGreeting()}, {user?.name}! 👋
              </h1>
              <p className="text-lg text-slate-600 mb-4">
                Here's what's happening with your dental scans today.
              </p>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{currentTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{currentTime.toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-glow">
                <Shield className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name} 
              className="card-elevated hover-lift group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                  <p className="text-xs text-slate-500 mb-2">{stat.description}</p>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                    <span className="text-xs text-slate-500">from last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Quick Actions</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Zap className="h-4 w-4" />
                <span>Frequently used</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.title}
                    onClick={() => navigate(action.href)}
                    className="group p-6 bg-gradient-to-br from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-300 text-left hover-lift"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors duration-200 mb-1">
                          {action.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-3">
                          {action.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm font-medium text-slate-500 group-hover:text-slate-700 transition-colors duration-200">
                          <span>{action.action}</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="card-elevated">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
              <div className="flex items-center space-x-2 text-sm text-slate-500">
                <Activity className="h-4 w-4" />
                <span>Live updates</span>
              </div>
            </div>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div 
                      key={activity.id} 
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200`}>
                        <Icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 mb-1">
                          {activity.type === 'scan_uploaded' ? 'Scan uploaded' : 
                           activity.type === 'scan_reviewed' ? 'Scan reviewed' : 
                           'Report generated'} for {activity.patient}
                        </p>
                        <p className="text-xs text-slate-500 mb-1">Patient ID: {activity.patientId}</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(activity.status)}
                          <span className="text-xs text-slate-500">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {isTechnician() ? 'Upload your first scan to see activity here.' : 'No scans have been uploaded yet.'}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200">
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific Insights */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isTechnician() && (
          <div className="card-elevated">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Upload className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Technician Tools</h3>
                <p className="text-sm text-slate-600">Your upload workspace</p>
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              As a technician, you can upload new patient scans and manage existing ones. 
              Use the upload form to add patient information and scan images with our secure cloud storage.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-slate-600">Upload success rate: 98.5%</span>
              </div>
            </div>
          </div>
        )}

        {isDentist() && (
          <div className="card-elevated">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dentist Dashboard</h3>
                <p className="text-sm text-slate-600">Your analysis workspace</p>
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              As a dentist, you can view and analyze all patient scans. 
              Use the scan viewer to browse through patient data and generate comprehensive reports.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <span className="text-slate-600">AI-powered insights available</span>
              </div>
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="card-elevated">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">System Status</h3>
              <p className="text-sm text-slate-600">All systems operational</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Cloud Storage</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">API Services</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
