import { useQuery } from 'react-query';
import { axiosInstance } from '../scripts/axiosInstance';
import { IUserDetails } from '../types';

export const useGetDetails = () => {
  const result = useQuery(
    ['userDetails'],
    async () => {
      const result = await axiosInstance.get('/details');
      return result.data as IUserDetails;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
  return result;
};
