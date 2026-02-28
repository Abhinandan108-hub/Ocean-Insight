# Quick Reference: Frontend-Backend Integration

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your config
npm run dev
# → http://localhost:4000

# Terminal 2: Start Frontend
cd frontend
npm install
cp .env.example .env.local
npm run dev
# → http://localhost:5173
```

## 🔐 Using Authentication

### Login in a Component
```tsx
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { login, error } = useAuth();
  
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
      // Get redirected automatically
    } catch (err) {
      console.error(error);
    }
  };
}
```

### Access Current User
```tsx
const { user, isAuthenticated } = useAuth();

if (isAuthenticated) {
  console.log(user.name);
  console.log(user.email);
  console.log(user.role);
}
```

### Logout
```tsx
const { logout } = useAuth();

<button onClick={logout}>Sign Out</button>
```

## 📡 Making API Requests

### Using API Hooks (React Query)
```tsx
import { useResources, useCreateResource } from '@/hooks/useApi';

export default function ResourceList() {
  // Fetch data
  const { data, isLoading, error } = useResources(page, limit);
  
  // Create data
  const createMutation = useCreateResource();
  
  const handleCreate = async (resourceData) => {
    await createMutation.mutateAsync(resourceData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data?.data?.resources?.map(r => (
        <div key={r.id}>{r.title}</div>
      ))}
    </div>
  );
}
```

### Direct API Client
```tsx
import { apiClient } from '@/services/api';

export default function MyComponent() {
  async function fetchUser() {
    try {
      const response = await apiClient.getProfile();
      console.log(response.data.user);
    } catch (error) {
      console.error(error.message);
    }
  }
  
  return <button onClick={fetchUser}>Get Profile</button>;
}
```

## 🔒 Protected Routes

```tsx
// In App.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Routes>
  <Route path="/login" element={<Login />} />
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />
</Routes>
```

## 📝 Common API Patterns

### Fetch Resources with Filters
```tsx
const { data } = useResources(1, 10, {
  search: 'ocean',
  gradeLevel: '10-12',
  subject: 'Science',
  type: 'Video'
});
```

### Search Resources
```tsx
const { data } = useSearchResources('argo floats');
```

### Create Resource (requires auth)
```tsx
const createMutation = useCreateResource();

await createMutation.mutateAsync({
  title: 'Ocean Temperature Study',
  description: 'Understanding thermal variations',
  content: 'Detailed content...',
  type: 'Lesson',
  gradeLevel: '11-12',
  subject: 'Ocean Science',
  mediaUrl: 'https://...',
  tags: ['temperature', 'ocean', 'data']
});
```

### Create and Share Collection
```tsx
const createCollectionMutation = useCreateCollection();
const shareCollectionMutation = useShareCollection();

// Create
const { data } = await createCollectionMutation.mutateAsync({
  title: 'My Resources',
  description: 'Collections I found useful'
});

// Share
await shareCollectionMutation.mutateAsync({
  collectionId: data.id,
  recipientEmail: 'friend@example.com'
});
```

## 🎯 Environment Variables

**Frontend (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_ENABLE_DEMO_MODE=true
```

**Backend (.env)**
```env
PORT=4000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/ocean-insight
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
```

## ❌ Common Errors & Solutions

### "Cannot POST /api/v1/auth/login"
- Check backend is running on :4000
- Check VITE_API_BASE_URL in .env.local
- Check browser Network tab for actual request URL

### "401 Unauthorized"
- Token expired or invalid
- Auto-refresh should handle this
- If not working, clear localStorage: `localStorage.clear()`

### "CORS error"
- Backend CORS not configured for :5173
- Check backend app.ts for cors setup

### "API not defined"
- Make sure .env.local exists with VITE_API_BASE_URL
- Vite env vars must start with VITE_

## 📊 Data Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    "user": { "id", "name", "email", "role" },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "Login successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": {
    "email": ["Email not found"],
    "password": ["Incorrect password"]
  }
}
```

## 🔧 Debugging Tips

### Check Current Auth State
```tsx
// In browser console
import { useAuth } from './contexts/AuthContext';
const auth = useAuth();
console.log(auth);
```

### Check Tokens
```javascript
// In browser console
localStorage.getItem('accessToken');
localStorage.getItem('refreshToken');
localStorage.getItem('user');
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action
4. Check request URL, headers, body, response

### Check API Response
```typescript
const response = await fetch('http://localhost:4000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password'
  })
});
console.log(await response.json());
```

## 📦 NPM Scripts

**Frontend:**
```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run preview   # Preview production build
npm run test      # Run tests
npm run lint      # Lint code
```

**Backend:**
```bash
npm run dev       # Start dev server
npm run prod      # Start production server
npm run build     # Build TypeScript
npm run test      # Run tests
npm run db:seed   # Seed database
```

## 🎓 Key Files to Know

| File | Purpose |
|------|---------|
| `frontend/src/services/api.ts` | All HTTP requests |
| `frontend/src/contexts/AuthContext.tsx` | Global auth state |
| `frontend/src/hooks/useApi.ts` | React Query hooks |
| `frontend/src/components/ProtectedRoute.tsx` | Route protection |
| `backend/src/routes/` | API endpoints |
| `backend/src/controllers/` | Business logic |
| `backend/src/models/` | Database schemas |

## 🧑‍💻 Example: Build Complete Feature

### 1. Create Resource Component
```tsx
import { useCreateResource } from '@/hooks/useApi';

export default function CreateResource() {
  const createMutation = useCreateResource();
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(form);
      toast.success('Resource created!');
      setForm({});
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

### 2. List Resources Component
```tsx
import { useResources } from '@/hooks/useApi';

export default function ResourceList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useResources(page, 10);

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {data?.data?.resources?.map(resource => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
      <Pagination page={page} onPageChange={setPage} />
    </div>
  );
}
```

## 🚀 Performance Tips

1. **Lazy load pages** - Use React.lazy for code splitting
2. **Use useCallback** - Prevent unnecessary function recreation
3. **Memoize components** - React.memo for expensive renders
4. **Query caching** - React Query handles this automatically
5. **Pagination** - Load data in pages, not all at once
6. **Debounce search** - Don't call API on every keystroke

## 📞 Need Help?

1. Check `FRONTEND_BACKEND_INTEGRATION.md` - Comprehensive guide
2. Check `SETUP_AND_TESTING_GUIDE.md` - Setup and troubleshooting
3. Check backend `API_DOCUMENTATION.md` - All endpoints
4. Review example code in `api.ts` and `useApi.ts`

---

**Happy coding! 🌊**
