import axiosInstance from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';

// fetch user data from API
const fetchUser = async () => {
  const response = await axiosInstance.get('/api/logged-in-user');
  return response.data.user;
};

const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUser,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
  if (isError) {
    console.log(error);
  }
  return { user, isLoading, isError, refetch };
};

export default useUser;
