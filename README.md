# OralVis Healthcare - Frontend (Client)

This is the React frontend application for the OralVis Healthcare system, built with Vite, React 18, and Tailwind CSS. It provides a modern, responsive interface for healthcare professionals to manage dental scan images.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see server/README.md)

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗 Project Structure

```
client/
├── public/                 # Static assets
│   └── vite.svg           # Vite logo
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.jsx     # Main layout wrapper
│   │   └── LoadingSpinner.jsx  # Loading indicator
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.jsx    # Authentication state management
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx      # Main dashboard
│   │   ├── Login.jsx          # Login page
│   │   ├── ScanViewer.jsx     # Scan viewing page (Dentist)
│   │   └── UploadScan.jsx     # Scan upload page (Technician)
│   ├── services/          # API and external services
│   │   └── api.js             # Axios configuration and API calls
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles and Tailwind imports
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite build configuration
└── postcss.config.js      # PostCSS configuration
```

## 🎯 Key Features

### Authentication System
- **Role-based access control** (Technician & Dentist)
- **JWT token management** with automatic refresh
- **Protected routes** based on user roles
- **Automatic logout** on token expiration

### Technician Features
- **Upload patient scans** with detailed form validation
- **Image preview** before upload
- **Drag & drop** file upload support
- **Real-time form validation** with error messages
- **Progress indicators** during upload

### Dentist Features
- **View all patient scans** with thumbnail grid
- **Search functionality** by patient name, ID, or scan type
- **Filter by region** (Frontal, Upper Arch, Lower Arch)
- **Full-size image viewing** in modal overlay
- **Download PDF reports** for individual scans

### Dashboard Features
- **Real-time statistics** from actual data
- **Recent activity feed** with actual scan uploads
- **Role-specific quick actions**
- **Responsive design** for all screen sizes

## 🛠 Tech Stack

### Core Technologies
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### UI/UX Libraries
- **React Hook Form** - Form handling and validation
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **Axios** - HTTP client for API calls

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📱 Component Architecture

### Authentication Context (`contexts/AuthContext.jsx`)
```javascript
// Provides authentication state and methods
const { user, login, logout, isAuthenticated, isTechnician, isDentist } = useAuth();
```

### API Service (`services/api.js`)
```javascript
// Configured Axios instance with interceptors
import { api } from '../services/api';

// Automatic token attachment and error handling
const response = await api.get('/scans');
```

### Page Components
- **Login.jsx**: Authentication form with role selection
- **Dashboard.jsx**: Main dashboard with statistics and quick actions
- **UploadScan.jsx**: Scan upload form for technicians
- **ScanViewer.jsx**: Scan viewing interface for dentists

## 🎨 Styling & Design

### Tailwind CSS Configuration
- **Custom color palette** for healthcare theme
- **Responsive breakpoints** for mobile-first design
- **Custom animations** and transitions
- **Component-based styling** with utility classes

### Design System
- **Consistent spacing** using Tailwind's spacing scale
- **Typography hierarchy** with custom font sizes
- **Color scheme** optimized for healthcare professionals
- **Accessibility** considerations with proper contrast ratios

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Dependencies
npm install          # Install dependencies
npm update           # Update dependencies
```

## 🌐 Environment Configuration

Create a `.env` file in the client directory:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api

# Development
VITE_NODE_ENV=development
```

### Environment Variables
- `VITE_API_URL`: Backend API base URL
- `VITE_NODE_ENV`: Environment mode (development/production)

## 🔌 API Integration

### Authentication Endpoints
```javascript
// Login
const response = await api.post('/auth/login', { email, password });

// Get user profile
const profile = await api.get('/auth/profile');

// Logout
await api.post('/auth/logout');
```

### Scan Management Endpoints
```javascript
// Upload scan (Technician)
const formData = new FormData();
formData.append('scanImage', file);
const upload = await api.post('/scans/upload', formData);

// Get all scans (Dentist)
const scans = await api.get('/scans');

// Download PDF report
const pdf = await api.get(`/scans/${scanId}/pdf`, { responseType: 'blob' });
```

## 🎯 State Management

### Authentication State
- **User information** (name, email, role)
- **Authentication status** (logged in/out)
- **Token management** (storage, refresh, cleanup)

### Component State
- **Form state** managed by React Hook Form
- **UI state** (loading, errors, modals) with useState
- **Data fetching** with useEffect and async/await

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- **Touch-friendly** interface elements
- **Optimized forms** for mobile input
- **Responsive images** with proper sizing
- **Accessible navigation** for all devices

## 🔒 Security Features

### Client-Side Security
- **Input validation** on all forms
- **XSS protection** with proper data sanitization
- **CSRF protection** via same-origin policy
- **Secure token storage** in localStorage

### API Security
- **Automatic token attachment** to requests
- **Token refresh** on expiration
- **Error handling** for authentication failures
- **CORS configuration** for cross-origin requests

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] User authentication flow
- [ ] Role-based access control
- [ ] Form validation and submission
- [ ] Image upload and preview
- [ ] Search and filter functionality
- [ ] PDF download functionality
- [ ] Responsive design on different devices
- [ ] Error handling and user feedback

### Browser Compatibility
- **Chrome** (latest)
- **Firefox** (latest)
- **Safari** (latest)
- **Edge** (latest)

## 🚀 Build & Deployment

### Production Build
```bash
npm run build
```

### Build Output
- **Optimized bundle** with code splitting
- **Minified assets** for faster loading
- **Static files** ready for deployment
- **Source maps** for debugging (optional)

### Deployment Options
- **Vercel**: Automatic deployment from GitHub
- **Netlify**: Static site hosting with forms
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repos

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
- Verify `VITE_API_URL` in `.env` file
- Ensure backend server is running
- Check CORS configuration

#### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT token expiration
- Verify user role permissions

### Debug Mode
```bash
# Enable debug logging
VITE_DEBUG=true npm run dev
```

## 📈 Performance Optimization

### Code Splitting
- **Route-based splitting** with React.lazy()
- **Component-based splitting** for large components
- **Dynamic imports** for heavy libraries

### Asset Optimization
- **Image optimization** before upload
- **Bundle analysis** with Vite bundle analyzer
- **Tree shaking** for unused code elimination

### Caching Strategy
- **Static assets** cached by CDN
- **API responses** cached in memory
- **User preferences** stored in localStorage

## 🔄 Development Workflow

### Git Workflow
1. **Create feature branch** from main
2. **Develop feature** with proper commits
3. **Test thoroughly** before merging
4. **Create pull request** for code review
5. **Merge to main** after approval

### Code Standards
- **ESLint configuration** for consistent code style
- **Prettier formatting** for code consistency
- **Component documentation** with JSDoc comments
- **Meaningful commit messages** following conventional commits

## 📚 Learning Resources

### React & Vite
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)

### Styling
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hook Form Documentation](https://react-hook-form.com/)

### State Management
- [React Context Documentation](https://react.dev/reference/react/useContext)
- [Axios Documentation](https://axios-http.com/)

## 🤝 Contributing

### Getting Started
1. **Fork the repository**
2. **Clone your fork** locally
3. **Install dependencies** with `npm install`
4. **Start development server** with `npm run dev`
5. **Make your changes** and test thoroughly
6. **Submit a pull request** with clear description

### Code Guidelines
- **Follow existing patterns** and conventions
- **Write meaningful commit messages**
- **Add comments** for complex logic
- **Test your changes** thoroughly
- **Update documentation** if needed

## 📞 Support

### Getting Help
- **Check existing issues** in GitHub repository
- **Create new issue** with detailed description
- **Contact development team** for urgent matters

### Documentation
- **API documentation** in server/README.md
- **Deployment guide** in DEPLOYMENT.md
- **Main project README** in root directory

---

**Happy Coding! 🚀**

*This frontend is part of the OralVis Healthcare system. For backend documentation, see `../server/README.md`*
