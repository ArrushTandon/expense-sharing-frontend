# 💰 Expense Sharing Application - Frontend

A modern, responsive React web application for managing shared expenses among groups. Built with React, React Router, and Axios, featuring JWT authentication, real-time balance calculations, and an intuitive user interface.

## 🌐 Live Demo

**Frontend**: [https://expense-sharing-frontend-orpin.vercel.app](https://expense-sharing-frontend-orpin.vercel.app)

**Backend API (Endpoints can be checked here)**: [https://web-production-6af04.up.railway.app/api/auth/test](https://web-production-6af04.up.railway.app/api/auth/test)

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Pages & Routes](#-pages--routes)
- [Components](#-components)
- [API Integration](#-api-integration)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Screenshots](#-screenshots)
- [Known Issues](#️-known-issues)
- [Future Enhancements](#-future-enhancements)

## 🎯 About the Project

This is a full-featured expense sharing web application that allows users to:
- Create groups with friends, family, or roommates
- Track shared expenses with multiple split types
- Automatically calculate who owes whom
- Settle up debts with simplified balance calculations
- Manage their profile and view activity history

The application is designed with security and user privacy in mind, implementing JWT-based authentication and role-based access control.

## ✨ Features

### Core Functionality
- **User Authentication**: Secure login and registration with JWT tokens
- **Dashboard**: Overview of balances, groups, and quick actions
- **Group Management**: Create, view, and manage expense groups
- **Expense Tracking**: Add expenses with three split types (Equal, Exact, Percentage)
- **Balance Calculation**: Real-time calculation of who owes whom
- **Simplified Settlements**: Minimize the number of transactions needed
- **Profile Management**: View account details and activity summary

### Split Types Supported
1. **Equal Split**: Divide expense evenly among all participants
2. **Exact Amount Split**: Specify exact amount for each person
3. **Percentage Split**: Split based on custom percentages

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: User-friendly error messages with actionable feedback
- **Form Validation**: Real-time validation with helpful hints
- **Animations**: Smooth transitions and hover effects

## 🛠️ Tech Stack

### Core Technologies
- **React 18** - UI library
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client for API requests
- **JWT Decode** - Token parsing and validation

### Development Tools
- **Create React App** - Project bootstrapping
- **ES6+** - Modern JavaScript features
- **CSS3** - Styling with animations

### Deployment
- **Vercel** - Frontend hosting with automatic deployments
- **GitHub** - Version control and CI/CD

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.x or higher
- **npm** 8.x or higher
- **Backend API** running (see backend README)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YourUsername/expense-sharing-frontend.git
cd expense-sharing-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:8080
```

For production, create `.env.production`:
```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

4. **Start the development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (one-way operation)
npm run eject
```

## 📁 Project Structure

```
expense-sharing-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── api/                    # API service layer
│   │   ├── axios.js            # Axios configuration with interceptors
│   │   ├── authService.js      # Authentication API calls
│   │   ├── userService.js      # User management API calls
│   │   ├── groupService.js     # Group management API calls
│   │   ├── expenseService.js   # Expense management API calls
│   │   ├── balanceService.js   # Balance calculation API calls
│   │   └── settlementService.js # Settlement API calls
│   ├── components/             # Reusable components
│   │   ├── ProtectedRoute.js   # Route protection wrapper
│   │   ├── LoadingSpinner.js   # Loading indicator
│   │   ├── ErrorAlert.js       # Error display component
│   │   └── SuccessToast.js     # Success message component
│   ├── context/                # React Context
│   │   └── AuthContext.js      # Authentication state management
│   ├── pages/                  # Main application pages
│   │   ├── LoginPage.js        # User login
│   │   ├── RegisterPage.js     # User registration
│   │   ├── DashboardPage.js    # Main dashboard
│   │   ├── GroupsPage.js       # Groups list
│   │   ├── CreateGroupPage.js  # Create new group
│   │   ├── GroupDetailPage.js  # Group details with tabs
│   │   ├── CreateExpensePage.js # Add new expense
│   │   ├── BalancesPage.js     # Detailed balances view
│   │   └── ProfilePage.js      # User profile
│   ├── styles/                 # Global styles
│   │   └── globalStyles.css    # Global CSS and animations
│   ├── App.js                  # Main app component with routes
│   ├── App.css                 # App-level styles
│   ├── index.js                # React entry point
│   └── index.css               # Global base styles
├── .env                        # Environment variables (local)
├── .env.production             # Production environment variables
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
├── vercel.json                 # Vercel deployment configuration
└── README.md                   # This file
```

## 🗺️ Pages & Routes

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | User authentication |
| `/register` | RegisterPage | New user registration |

### Protected Routes (Require Authentication)
| Route | Page | Description |
|-------|------|-------------|
| `/` | Redirect to Dashboard | Root redirect |
| `/dashboard` | DashboardPage | Main overview with balances and groups |
| `/groups` | GroupsPage | List of all user's groups |
| `/groups/new` | CreateGroupPage | Create a new group |
| `/groups/:groupId` | GroupDetailPage | Group details, expenses, members, balances |
| `/groups/:groupId/expenses/new` | CreateExpensePage | Add expense to group |
| `/balances` | BalancesPage | Detailed view of all balances |
| `/profile` | ProfilePage | User profile and account info |

## 🧩 Components

### LoadingSpinner
Displays a spinning loader with optional message.

**Usage:**
```javascript
<LoadingSpinner message="Loading data..." />
```

### ErrorAlert
Displays error messages with close button.

**Usage:**
```javascript
<ErrorAlert error={error} onClose={() => setError('')} />
```

### SuccessToast
Shows temporary success messages (auto-dismisses after 3 seconds).

**Usage:**
```javascript
<SuccessToast 
  message="Group created successfully!" 
  onClose={() => setSuccess('')}
  duration={3000}
/>
```

### ProtectedRoute
Wraps routes that require authentication.

**Usage:**
```javascript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## 🔌 API Integration

### Base Configuration (`api/axios.js`)

```javascript
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
});
```

**Features:**
- Automatic JWT token injection in request headers
- Automatic logout on 401 (Unauthorized) responses
- User feedback on 403 (Forbidden) responses
- Centralized error handling

### Request Interceptor
```javascript
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor
```javascript
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 Security Features

### Authentication
- **JWT Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
- **Token Validation**: Client-side validation before storage
- **Token Expiration**: Automatic logout when token expires
- **Secure Password Input**: Password fields use type="password"

### Authorization
- **Protected Routes**: Unauthorized users redirected to login
- **Role-Based Access**: Admin-only features (if applicable)
- **API Request Auth**: JWT token sent with every API request

### Input Validation
- **Client-Side Validation**: Immediate feedback before API calls
- **Email Format**: Regex validation for email addresses
- **Password Strength**: Minimum 6 characters with visual feedback
- **Real-Time Validation**: Live validation as user types

### Privacy
- **Group Privacy**: Users only see groups they're members of
- **Data Privacy**: Cannot access other users' data
- **Secure API Calls**: All requests authenticated

### Error Handling
- **User-Friendly Messages**: No technical details exposed
- **Network Error Handling**: Graceful handling of connection issues
- **Rate Limiting Ready**: Backend implements rate limiting

## 🚀 Deployment

### Deployed on Vercel

**Automatic Deployments:**
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Environment variables configured in Vercel dashboard

### Environment Variables (Vercel)

Set these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

### Build Configuration

**Framework Preset**: Create React App

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### Custom Configuration (`vercel.json`)

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures React Router works correctly on page refresh.

### Deployment Steps

1. **Push to GitHub**
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. **Vercel Auto-Deploys**
   - Monitors GitHub repository
   - Builds and deploys automatically
   - Takes 2-3 minutes

3. **Verify Deployment**
   - Check deployment logs in Vercel
   - Test the live URL
   - Verify API connectivity

## 📸 Screenshots

### Login Page
Clean and modern authentication interface with real-time validation.

### Dashboard
Overview of balances, groups, and quick actions at a glance.

### Groups
Grid view of all groups with member counts and descriptions.

### Group Detail
Tabbed interface showing expenses, balances, and members.

### Create Expense
Step-by-step form with live split preview for all three split types.

### Balances
Clear visualization of who owes whom with net balance calculations.

### Profile
User profile with account information and activity summary.

## Browser Compatibility

**Tested and Working:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🚧 Future Enhancements

- [ ] Add Different Currencies
- [ ] Dark mode theme
- [ ] Receipt/image upload for expenses
- [ ] Currency conversion

## 🐛 Troubleshooting

### Issue: White Screen on Deployment

**Cause**: JavaScript error during build or runtime

**Fix:**
1. Check browser console (F12) for errors
2. Verify environment variables in Vercel
3. Check deployment logs in Vercel dashboard

### Issue: CORS Error

**Cause**: Backend not configured to allow frontend origin

**Fix:**
1. Update `CORS_ALLOWED_ORIGINS` in backend Railway variables
2. Ensure no trailing slash in URL
3. Use `https://` not `http://` for production

### Issue: Login Not Working

**Cause**: Backend not reachable or token issues

**Fix:**
1. Verify backend is running: `https://your-backend.railway.app/api/auth/test`
2. Check network tab (F12) for failed requests
3. Clear localStorage and try again

### Issue: Page Refresh Returns 404

**Cause**: Vercel routing not configured

**Fix:**
Ensure `vercel.json` exists with proper rewrite rules

## 📚 Learning Resources

This project demonstrates:
- React Hooks (useState, useEffect, useContext)
- React Router for SPA routing
- JWT authentication flow
- Protected routes implementation
- API integration with Axios
- Error boundary patterns
- Loading states and UX patterns
- Responsive design principles
- Form validation
- CSS animations

## 🤝 Contributing

This is a learning project. Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of an educational assignment and is open for learning purposes.

## 👤 Author

**Arrush Tandon**
- GitHub: [@ArrushTandon](https://github.com/ArrushTandon)
- LinkedIn: [Arrush Tandon](https://www.linkedin.com/in/arrush-tandon/)

## 🙏 Acknowledgments

- Inspired by Splitwise
- Built as a full-stack web development learning project
- Backend API: [Expense Sharing Backend](https://github.com/ArrushTandon/expense-sharing-application)
- Uses modern React patterns and best practices
- Deployed on Vercel for seamless CI/CD

## 🔗 Related Projects

- **Backend Repository**: [expense-sharing-application](https://github.com/ArrushTandon/expense-sharing-application)
- **API Documentation**: See backend README for API endpoints

## 📊 Project Statistics

- **React Components**: 15+
- **Pages**: 8
- **API Endpoints Used**: 20+
- **Lines of Code**: ~3,000+
- **Development Time**: Educational project
- **Deployment Platform**: Vercel
- **Backend Platform**: Railway

---

**Built with ❤️ for learning full-stack web development and cybersecurity principles**

## 🎯 Key Takeaways

This project demonstrates:
- ✅ Full-stack application architecture
- ✅ JWT authentication implementation
- ✅ RESTful API integration
- ✅ Modern React patterns
- ✅ Responsive UI/UX design
- ✅ Security-conscious development
- ✅ Production deployment workflow
- ✅ Environment-based configuration

Perfect for portfolios and job interviews! 🚀
