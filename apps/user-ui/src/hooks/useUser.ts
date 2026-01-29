import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get('/api/logged-in-user');
    if (!response.data || !response.data.user) {
      return null;
    }

    return response.data.user;
  } catch (error: any) {
    console.error('Failed to fetch user:', error?.message || error);
    return null;
  }
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
    initialData: null,
  });

  if (isError) {
    console.error('User query error:', error);
  }

  return { user, isLoading, isError, refetch };
};

export default useUser;
