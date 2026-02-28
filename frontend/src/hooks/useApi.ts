import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../services/api';

/**
 * Custom hooks for React Query integration
 * Provides convenient abstractions for API calls with caching and state management
 */

// ==================== Resources ====================

export function useResources(page = 1, limit = 10, filters?: any) {
  return useQuery({
    queryKey: ['resources', page, limit, filters],
    queryFn: () => apiClient.getResources(page, limit, filters),
    enabled: true,
  });
}

export function useSearchResources(query: string) {
  return useQuery({
    queryKey: ['resources', 'search', query],
    queryFn: () => apiClient.searchResources(query),
    enabled: !!query,
  });
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resources', id],
    queryFn: () => apiClient.getResource(id),
    enabled: !!id,
  });
}

export function useCreateResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });
}

export function useUpdateResource(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources', id] });
    },
  });
}

export function useDeleteResource(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.deleteResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['resources', id] });
    },
  });
}

// ==================== Collections ====================

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => apiClient.getCollections(),
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: ['collections', id],
    queryFn: () => apiClient.getCollection(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      apiClient.createCollection(data.title, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useUpdateCollection(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; description: string }) =>
      apiClient.updateCollection(id, data.title, data.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', id] });
    },
  });
}

export function useDeleteCollection(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      queryClient.invalidateQueries({ queryKey: ['collections', id] });
    },
  });
}

export function useAddToCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { collectionId: string; resourceId: string }) =>
      apiClient.addToCollection(data.collectionId, data.resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useRemoveFromCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { collectionId: string; resourceId: string }) =>
      apiClient.removeFromCollection(data.collectionId, data.resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
}

export function useShareCollection() {
  return useMutation({
    mutationFn: (data: { collectionId: string; recipientEmail: string }) =>
      apiClient.shareCollection(data.collectionId, data.recipientEmail),
  });
}

// ==================== Events ====================

export function useEvents(page = 1, limit = 10) {
  return useQuery({
    queryKey: ['events', page, limit],
    queryFn: () => apiClient.getEvents(page, limit),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => apiClient.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
    },
  });
}

export function useDeleteEvent(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', id] });
    },
  });
}

export function useRegisterForEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => apiClient.registerForEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUnregisterFromEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => apiClient.unregisterFromEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// ==================== Admin ====================

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiClient.getDashboardStats(),
  });
}

export function useLogs(page = 1, limit = 50) {
  return useQuery({
    queryKey: ['admin', 'logs', page, limit],
    queryFn: () => apiClient.getLogs(page, limit),
  });
}

export function usePublishResource() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resourceId: string) => apiClient.publishResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
  });
}

export function useUpdateUserRole() {
  return useMutation({
    mutationFn: (data: { userId: string; role: string }) =>
      apiClient.updateUserRole(data.userId, data.role),
  });
}

// ==================== Auth ====================

export function useProfile() {
  return useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: () => apiClient.getProfile(),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => apiClient.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) =>
      apiClient.resetPassword(data.token, data.newPassword),
  });
}
