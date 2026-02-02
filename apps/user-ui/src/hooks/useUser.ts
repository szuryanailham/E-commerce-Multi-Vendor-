import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const res = await axiosInstance.get('/api/logged-in-user');
    return res?.data?.user ?? null;
  } catch (error: any) {
    return null;
  }
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ['user'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetchUser: refetch,
  };
};

export default useUser;
