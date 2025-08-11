import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { publicGet, publicPost, privateGet, privatePost, privatePut, privateDelete } from './apiCaller';
import { useAuth } from '../context/AuthContext';

// Food API hooks
export const useFoods = () => {
  return useQuery({
    queryKey: ['foods'],
    queryFn: async () => {
      try {
        const response = await publicGet('/foods');
        console.log('Foods API Response:', response);
        return response.data || response || [];
      } catch (error) {
        console.error('Error fetching foods:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFood = (id: string) => {
  return useQuery({
    queryKey: ['food', id],
    queryFn: async () => {
      try {
        const response = await publicGet(`/foods/${id}`);
        return response.data || response;
      } catch (error) {
        console.error('Error fetching food:', error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Cart functionality is now handled by CartContext using AsyncStorage
// Removed cart API hooks as they are no longer needed

// Order API hooks
export const useOrders = () => {
  const { state } = useAuth();

  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const response = await privateGet('/orders', state.token || '');
        return response.data || response;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },
    enabled: !!state.token,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { state } = useAuth();

  return useMutation({
    mutationFn: async (orderData: any) => {
      try {
        const response = await privatePost('/orders', state.token || '', orderData);
        return response;
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// User profile hooks
export const useUserProfile = () => {
  const { state } = useAuth();

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      try {
        const response = await privateGet('/user/profile', state.token || '');
        return response.data || response;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
    },
    enabled: !!state.token,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { state } = useAuth();

  return useMutation({
    mutationFn: async (profileData: any) => {
      try {
        const response = await privatePut('/user/profile', state.token || '', profileData);
        return response;
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

// Offers API hooks
export const useOffers = () => {
  return useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      try {
        const response = await publicGet('/offers');
        return response.data || response || [];
      } catch (error) {
        console.error('Error fetching offers:', error);
        throw error;
      }
    },
  });
};
