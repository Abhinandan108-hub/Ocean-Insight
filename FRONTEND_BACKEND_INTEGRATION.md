# Frontend-Backend Integration Guide

## Overview

The Ocean Insight platform uses a modern full-stack architecture with:
- **Backend**: Node.js/Express with TypeScript (port 4000)
- **Frontend**: React with TypeScript + Vite (port 5173)
- **Communication**: REST API with JWT authentication
- **State Management**: React Context API + React Query

## Architecture

```
Frontend (React)
    ↓
HTTP Requests (Fetch API)
    ↓
API Client Service (src/services/api.ts)
    ↓
Backend REST API (Express)
    ↓
Database (MongoDB)
```

## Key Features

### 1. API Client Service (`src/services/api.ts`)

The API client is a singleton class that handles all HTTP communication:

```typescript
import { apiClient } from '@/services/api';

// Authentication
await apiClient.login(email, password);
// note: confirmPassword now required by client wrapper (backend validation is optional)
await apiClient.register(name, email, password, password);
await apiClient.logout();

// Resources
await apiClient.getResources(page, limit, filters);
await apiClient.searchResources(query);
await apiClient.getResource(id);
await apiClient.createResource(data);

// Collections
await apiClient.getCollections();
await apiClient.createCollection(title, description);
await apiClient.shareCollection(collectionId, recipientEmail);

// Events
await apiClient.getEvents(page, limit);
await apiClient.registerForEvent(eventId);

// Admin
await apiClient.getDashboardStats();
await apiClient.getLogs(page, limit);
```

**Features:**
- ✅ Automatic token management (localStorage)
- ✅ Token refresh on 401 response
- ✅ Error handling with detailed messages
- ✅ Base URL configuration via environment variables
- ✅ Request retry logic
- ✅ Consistent response format

### 2. Authentication Context (`src/contexts/AuthContext.tsx`)

Provides global authentication state and methods:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, register, logout, error } = useAuth();

  // user: { id, name, email, role, avatar }
  // isAuthenticated: boolean
  // isLoading: boolean
  // error: string | null
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // User is now logged in
    } catch (err) {
      // Handle error
    }
  };
}
```

**Features:**
- ✅ Automatic initialization from localStorage
- ✅ Token persistence across page reloads
- ✅ Automatic token refresh
- ✅ Global error state
- ✅ Loading state management

### 3. API Hooks (`src/hooks/useApi.ts`)

React Query hooks for data fetching with caching:

```typescript
import { 
  useResources, 
  useSearchResources,
  useCollections,
  useCreateResource
} from '@/hooks/useApi';

function ResourceList() {
  const { data, isLoading, error } = useResources(page, limit, filters);
  
  const createMutation = useCreateResource();
  
  const handleCreate = async (resourceData) => {
    await createMutation.mutateAsync(resourceData);
    // Cache automatically invalidated
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render resources */}</div>;
}
```

**Available Hooks:**
- **Resources**: `useResources`, `useSearchResources`, `useResource`, `useCreateResource`, `useUpdateResource`, `useDeleteResource`
- **Collections**: `useCollections`, `useCollection`, `useCreateCollection`, `useUpdateCollection`, `useDeleteCollection`, `useAddToCollection`, `useRemoveFromCollection`
- **Events**: `useEvents`, `useEvent`, `useCreateEvent`, `useUpdateEvent`, `useDeleteEvent`, `useRegisterForEvent`
- **Admin**: `useDashboardStats`, `useLogs`, `usePublishResource`, `useUpdateUserRole`
- **Auth**: `useProfile`, `useForgotPassword`, `useResetPassword`

### 4. Protected Routes (`src/components/ProtectedRoute.tsx`)

Wrapper component to guard authenticated routes:

```tsx
import { ProtectedRoute, AdminRoute } from '@/components/ProtectedRoute';

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
  <Route
    path="/admin"
    element={
      <AdminRoute>
        <AdminPanel />
      </AdminRoute>
    }
  />
</Routes>
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:4000`

### 2. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### 3. Environment Configuration

**Frontend** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_ENABLE_DEMO_MODE=true
```

**Backend** (`.env`):
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/ocean-insight
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## API Request Flow

### Example: Login Flow

1. **User submits login form**
   ```jsx
   const { login } = useAuth();
   await login(email, password);
   ```

2. **Auth Context calls API Client**
   ```typescript
   // AuthContext.tsx
   const response = await apiClient.login(email, password);
   ```

3. **API Client makes HTTP request**
   ```typescript
   // api.ts
   POST http://localhost:4000/api/v1/auth/login
   {
     "email": "user@example.com",
     "password": "password"
   }
   ```

4. **Backend processes request**
   ```typescript
   // Backend validates credentials, returns tokens
   {
     "success": true,
     "data": {
       "user": { "id", "name", "email", "role" },
       "accessToken": "token...",
       "refreshToken": "token..."
     }
   }
   ```

5. **API Client stores tokens**
   ```typescript
   this.saveTokens(accessToken, refreshToken);
   localStorage.setItem('user', JSON.stringify(user));
   ```

6. **Auth Context updates global state**
   ```typescript
   setUser(response.data.user);
   ```

7. **App redirects to dashboard**
   ```typescript
   navigate('/dashboard');
   ```

## Error Handling

All errors follow a consistent format:

```typescript
interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>; // Validation errors
}

try {
  await apiClient.login(email, password);
} catch (err) {
  console.error(err.status);    // 401
  console.error(err.message);   // "Invalid credentials"
  console.error(err.errors);    // { email: ["Email not found"] }
}
```

## Token Management

Tokens are automatically managed by the API client:

1. **Access Token**: Sent with every request in `Authorization: Bearer <token>` header
2. **Refresh Token**: Stored in localStorage, used to get new access token when expired
3. **Auto-Refresh**: When a request returns 401, the client automatically refreshes the token and retries

```typescript
// Automatic token refresh (transparent to user)
GET /api/v1/protected-endpoint
  → 401 Unauthorized
  → POST /api/v1/auth/refresh (with refreshToken)
  → Get new accessToken
  → Retry original request
```

## Integration Examples

### Login Page

```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error is already in context.error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}
```

### Resource List

```tsx
import { useResources } from '@/hooks/useApi';

export default function ResourceList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useResources(page, 10);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.resources?.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

### Create Resource

```tsx
import { useCreateResource } from '@/hooks/useApi';

export default function CreateResource() {
  const createMutation = useCreateResource();
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
      // Success - cache automatically invalidated
      toast.success('Resource created');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createMutation.isPending}>
        {createMutation.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

## Common Issues & Solutions

### 1. **CORS Errors**
**Problem**: GET/POST requests fail with CORS error
**Solution**: Backend must have CORS configured in `app.ts`:
```typescript
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
```

### 2. **API URL Not Found**
**Problem**: 404 errors on all requests
**Solution**: 
- Check `VITE_API_BASE_URL` in `.env.local`
- Ensure backend is running on port 4000
- Check backend routes are prefixed with `/api/v1`

### 3. **Token Expiration**
**Problem**: Requests fail after 15 minutes
**Solution**: Automatic token refresh handles this. If not working:
- Check refresh token exists in localStorage
- Verify `JWT_SECRET` and `REFRESH_TOKEN_SECRET` match backend
- Check token expiry times in backend

### 4. **Stale Data**
**Problem**: Data doesn't update after mutations
**Solution**: React Query cache automatically invalidates. If not:
- Check mutation's `onSuccess` callback calls `queryClient.invalidateQueries`
- Verify query keys match between useQuery and invalidation

## Next Steps

1. **Update Dashboard** to call API endpoints:
   - Fetch user profile on load
   - Display user stats from `/admin/dashboard`
   - Implement logout button

2. **Implement Resource Browsing**:
   - Use `useResources` hook to fetch resources
   - Implement search with `useSearchResources`
   - Add filtering by grade, subject, type

3. **Implement Collections**:
   - Allow users to create collections
   - Add/remove resources from collections
   - Share collections with others

4. **Implement Events**:
   - Display upcoming events
   - Allow registration/unregistration
   - Show event details

5. **Admin Features**:
   - Create admin dashboard
   - View system stats and logs
   - Manage users and resources

## Reference

- Backend API Documentation: `../backend/API_DOCUMENTATION.md`
- React Query Documentation: https://tanstack.com/query/v4
- React Context API: https://react.dev/reference/react/useContext
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
