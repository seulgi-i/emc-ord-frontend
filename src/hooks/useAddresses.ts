import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAddresses, addAddress, updateAddress, deleteAddress } from '@/components/features/address/api/addressApi';
import { Address, AddressFormValues, AddressPagination } from '@/lib/schemas/address.schemas';

interface UseAddressesOptions {
  page?: number;
  pageSize?: number;
}

const useAddresses = (options: UseAddressesOptions = {}) => {
  const { page = 1, pageSize = 5 } = options;
  const queryClient = useQueryClient();

  // 배송지 목록 조회 쿼리
  const { data, isLoading, isError, error } = useQuery<AddressPagination, Error>({
    queryKey: ['addresses', page, pageSize],
    queryFn: () => fetchAddresses(page, pageSize),
    initialData: {
      data: [], 
      total: 0,
      page: page,
      pageSize: pageSize,
    },
  });

  // 배송지 추가 뮤테이션
  const addAddressMutation = useMutation<Address, Error, AddressFormValues>({
    mutationFn: addAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] }); // 주소 목록 쿼리 무효화하여 새로고침
    },
  });

  // 배송지 수정 뮤테이션
  const updateAddressMutation = useMutation<Address, Error, { id: string; data: AddressFormValues }>({
    mutationFn: ({ id, data }) => updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] }); // 주소 목록 쿼리 무효화하여 새로고침
    },
  });

  // 배송지 삭제 뮤테이션
  const deleteAddressMutation = useMutation<void, Error, string>({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] }); // 주소 목록 쿼리 무효화하여 새로고침
    },
  });

  return {
    addresses: data?.data || [],
    totalAddresses: data?.total || 0,
    currentPage: data?.page || page,
    pageSize: data?.pageSize || pageSize,
    isLoading,
    isError,
    error,
    addAddress: addAddressMutation.mutate,
    updateAddress: updateAddressMutation.mutate,
    deleteAddress: deleteAddressMutation.mutate,
    isAdding: addAddressMutation.isPending,
    isUpdating: updateAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
  };
};

export default useAddresses;
