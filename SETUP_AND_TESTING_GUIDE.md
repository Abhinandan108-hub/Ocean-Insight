# Ocean Insight - Frontend-Backend Connection Setup Guide

This guide walks you through setting up and testing the complete frontend-backend integration for the Ocean Insight platform.

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or bun
- MongoDB (local or cloud - Atlas)
- Git (optional)

## 🚀 Quick Start

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

**Backend .env Configuration:**
```env
# Server
PORT=4000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/ocean-insight
# OR for MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/ocean-insight

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-key-change-this-in-production

# Email (for password reset and notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password  # Google App Password if using Gmail
SMTP_FROM=noreply@oceaninsight.com

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**To generate Gmail App Password:**
1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → App passwords
3. Select Mail and Windows Computer
4. Copy the generated 16-character password
5. Paste it as `SMTP_PASSWORD` in .env

### Step 2: Start Backend Server

```bash
# From backend directory
npm run dev
```

You should see:
```
✓ Server running on http://localhost:4000
✓ Connected to MongoDB
✓ API documentation: http://localhost:4000/api-docs
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# .env.local should contain:
# VITE_API_BASE_URL=http://localhost:4000/api/v1
# VITE_ENABLE_DEMO_MODE=true
```

### Step 4: Start Frontend Server

```bash
# From frontend directory
npm run dev
```

You should see:
```
VITE v... ready in ... ms

➜  Local:   http://localhost:5173/
```

## 🧪 Testing the Integration

### Test 1: User Registration

1. Open http://localhost:5173/signup
2. Fill in the form:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPass123!
   - Confirm Password: TestPass123!
3. Click "Create Account"
4. **Expected**: Should be redirected to /dashboard

### Test 2: User Login

1. Open http://localhost:5173/login
2. Fill in the form:
   - Email: testuser@example.com
   - Password: TestPass123!
3. Click "Sign In"
4. **Expected**: Should be redirected to /dashboard, user info displayed

### Test 3: Protected Routes

1. In browser, try to access: http://localhost:5173/dashboard without logging in
2. **Expected**: Should redirect to /login automatically

### Test 4: Logout

1. From dashboard, click "Sign out"
2. **Expected**: Should redirect to /login

### Test 5: Token Persistence

1. Login to dashboard
2. Refresh page (F5)
3. **Expected**: Should remain logged in (user data persists)

### Test 6: Demo Login

1. Open http://localhost:5173/login
2. Click "Continue as Demo User"
3. **Expected**: Should login with demo account and redirect to dashboard

## 📁 Project Structure

```
Ocean-Insight/
├── backend/
│   ├── src/
│   │   ├── models/          # Database schemas
│   │   ├── controllers/      # Route handlers
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication, logging, etc.
│   │   ├── validations/     # Joi schemas
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   ├── config/          # Database config
│   │   ├── app.ts           # Express app setup
│   │   └── index.ts         # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ui/         # Shadcn UI components
│   │   │   └── floatchat/  # Custom components
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Index.tsx
│   │   ├── contexts/       # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/          # Custom hooks
│   │   │   ├── useAuth.ts (from AuthContext)
│   │   │   └── useApi.ts   # React Query hooks
│   │   ├── services/       # API client
│   │   │   └── api.ts
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── .env.example
│   ├── .env.local          # Local development
│   └── README.md
│
├── FRONTEND_BACKEND_INTEGRATION.md  # Integration guide
└── README.md
```

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/v1/auth/register` - Create account
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### Resources
- `GET /api/v1/resources` - List resources (paginated)
- `GET /api/v1/resources/search?q=query` - Search resources
- `GET /api/v1/resources/:id` - Get resource details
- `POST /api/v1/resources` - Create resource (protect)
- `PUT /api/v1/resources/:id` - Update resource
- `DELETE /api/v1/resources/:id` - Delete resource

### Collections
- `GET /api/v1/collections` - List user's collections
- `POST /api/v1/collections` - Create collection
- `GET /api/v1/collections/:id` - Get collection details
- `PUT /api/v1/collections/:id` - Update collection
- `DELETE /api/v1/collections/:id` - Delete collection
- `POST /api/v1/collections/:id/add` - Add resource
- `POST /api/v1/collections/:id/remove` - Remove resource
- `POST /api/v1/collections/:id/share` - Share collection via email

### Events
- `GET /api/v1/events` - List events
- `POST /api/v1/events` - Create event (Admin)
- `GET /api/v1/events/:id` - Get event details
- `PUT /api/v1/events/:id` - Update event
- `DELETE /api/v1/events/:id` - Delete event
- `POST /api/v1/events/:id/register` - Register for event
- `POST /api/v1/events/:id/unregister` - Unregister from event

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats (Admin)
- `GET /api/v1/admin/logs` - System logs (Admin)
- `POST /api/v1/admin/resources/:id/publish` - Publish resource (Admin)
- `PUT /api/v1/admin/users/:id/role` - Update user role (Admin)

## 🐛 Troubleshooting

### Issue: Backend won't start / Port 4000 already in use

**Solution:**
```bash
# Find process using port 4000
netstat -ano | findstr :4000  # Windows
lsof -i :4000                  # Mac/Linux

# Kill process
taskkill /PID <PID> /F         # Windows
kill -9 <PID>                   # Mac/Linux

# Or change PORT in .env to 4001
```

### Issue: "Cannot POST /api/v1/auth/register" Error

**Check:**
1. Backend is running on port 4000: `curl http://localhost:4000/health`
2. VITE_API_BASE_URL is correct in frontend `.env.local`
3. Backend has CORS enabled for localhost:5173
4. Check browser Network tab - what's the actual request URL?

### Issue: "Cannot find module 'react-query'" 

**Solution:**
```bash
cd frontend
npm install @tanstack/react-query
```

### Issue: MongoDB connection error

**Check:**
1. MongoDB is running locally: `mongosh` or `mongo`
2. DATABASE_URL is correct in .env
3. If using Atlas, create a cluster and add connection string
4. Whitelist your IP in MongoDB Atlas

### Issue: Email not sending (password reset)

**Check:**
1. SMTP credentials are correct in .env
2. If using Gmail, use App Password (not your regular password)
3. Check console logs for SMTP errors
4. Try with a test email first: `testuser@example.com`

### Issue: Tokens not persisting after refresh

**Check:**
1. Clear localStorage: `localStorage.clear()` in browser console
2. Make sure cookies / localStorage are enabled
3. Check `AuthContext.tsx` is wrapping app correctly in `App.tsx`

## 📊 Testing with Postman

You can test API endpoints with Postman:

1. Create new request in Postman
2. Set method to POST, URL to `http://localhost:4000/api/v1/auth/register`
3. In Body tab, select JSON and add:
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!"
}
```
4. Click Send
5. Response should have access and refresh tokens

For authenticated requests:
1. Copy the `accessToken` from login response
2. In Headers tab, add: `Authorization: Bearer <token>`
3. Send request

## 🔐 Security Notes

For production deployment:
1. ✅ Change JWT_SECRET to a strong random value
2. ✅ Use environment variables (never commit .env)
3. ✅ Enable HTTPS/TLS
4. ✅ Set NODE_ENV=production
5. ✅ Use CORS whitelist (don't use *)
6. ✅ Enable CSRF protection
7. ✅ Use secure session cookies
8. ✅ Implement rate limiting (already added)
9. ✅ Add request validation (already added with Joi)
10. ✅ Setup monitoring and logging (Winston configured)

## 📚 Next Steps

After successful setup:

1. **Explore API Documentation**: http://localhost:4000/api-docs
2. **Test All Endpoints**: Use Postman collection or browser
3. **Build More Pages**:
   - Resources browser page
   - Collections management page
   - Events listing page
   - Admin dashboard
4. **Add More Features**:
   - Search bar
   - Filters by grade/subject
   - User profile editing
   - Password change

## 💡 Key Files to Review

- **API Client**: `frontend/src/services/api.ts` - All HTTP logic
- **Auth Context**: `frontend/src/contexts/AuthContext.tsx` - Global auth state
- **Auth Hooks**: `frontend/src/hooks/useApi.ts` - React Query hooks
- **Backend Routes**: `backend/src/routes/` - All API endpoints
- **Backend Controllers**: `backend/src/controllers/` - Business logic

## 📞 Support

If you encounter issues:

1. Check backend logs: Terminal where `npm run dev` is running
2. Check frontend logs: Browser DevTools → Console
3. Check network requests: DevTools → Network tab
4. Check backend database: MongoDB Atlas dashboard
5. Review full integration guide: `FRONTEND_BACKEND_INTEGRATION.md`

## ✅ Checklist

Before going to production:

- [ ] Backend tests passing
- [ ] Frontend tests passing
- [ ] All CRUD operations working
- [ ] Authentication flow complete
- [ ] Protected routes enforced
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Email notifications working
- [ ] Rate limiting active
- [ ] Input validation enabled
- [ ] CORS properly configured
- [ ] Deployment strategy planned

---

**Happy coding! 🌊**
