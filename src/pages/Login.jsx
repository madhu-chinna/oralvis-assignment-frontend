import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Heart,
  Stethoscope,
  Sparkles,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Welcome back! Login successful!');
        navigate('/dashboard');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    {
      role: 'Technician',
      email: 'demo-technician@oralvis.com',
      password: 'demo-password-123',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-500',
      description: 'Upload and manage patient scans'
    },
    {
      role: 'Dentist',
      email: 'demo-dentist@oralvis.com',
      password: 'demo-password-123',
      icon: Heart,
      color: 'from-emerald-500 to-teal-500',
      description: 'View and analyze patient data'
    }
  ];

  const handleDemoLogin = (credential) => {
    setFormData({
      email: credential.email,
      password: credential.password
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30">
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-200/20 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-cyan-200/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side - Branding and Features */}
            <div className="hidden lg:block space-y-8 animate-slide-up">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-glow">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-gradient font-display">
                      OralVis
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">
                      Healthcare Portal
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                    Advanced Dental Scan
                    <span className="block text-gradient">Management System</span>
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Streamline your dental practice with our comprehensive scan management platform. 
                    Secure, efficient, and designed for healthcare professionals.
                  </p>
                </div>
              </div>

              {/* Feature highlights */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Shield, text: 'HIPAA Compliant Security', color: 'text-blue-600' },
                  { icon: Stethoscope, text: 'Professional Workflow Tools', color: 'text-emerald-600' },
                  { icon: Heart, text: 'Patient-Centric Design', color: 'text-rose-600' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/80 transition-all duration-300">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r from-slate-100 to-slate-200 flex items-center justify-center`}>
                      <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    </div>
                    <span className="font-medium text-slate-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Login Form */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <div className="card-elevated animate-scale-in">
                {/* Mobile header */}
                <div className="lg:hidden text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-glow">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-gradient font-display mb-2">
                    OralVis
                  </h1>
                  <p className="text-slate-600">Healthcare Portal</p>
                </div>

                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-slate-600">
                      Sign in to access your dashboard
                    </p>
                  </div>

                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Mail className={`h-5 w-5 transition-colors duration-200 ${
                            focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'
                          }`} />
                        </div>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          className="input-field pl-12"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className={`h-5 w-5 transition-colors duration-200 ${
                            focusedField === 'password' ? 'text-blue-500' : 'text-slate-400'
                          }`} />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          required
                          className="input-field pl-12 pr-12"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors duration-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="loading-spinner"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Sign In</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      )}
                    </button>
                  </form>

                  {/* Demo Credentials */}
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500 font-medium">Demo Accounts</span>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {demoCredentials.map((credential, index) => {
                        const Icon = credential.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handleDemoLogin(credential)}
                            className="group p-4 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 bg-gradient-to-r ${credential.color} rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 group-hover:text-slate-700 transition-colors duration-200">
                                  {credential.role}
                                </p>
                                <p className="text-sm text-slate-600 truncate">
                                  {credential.email}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {credential.description}
                                </p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
