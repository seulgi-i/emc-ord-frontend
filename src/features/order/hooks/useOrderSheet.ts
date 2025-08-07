import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderFormSchema } from '@/features/order/order.schemas';
import { OrderFormValues, OrderPayload } from '@/features/order/order.types';
import { fetchProducts, fetchDiscount, fetchPayment, submitOrder } from '@/features/order/api/orderApi';

const useOrderSheet = () => {
  const queryClient = useQueryClient();

  const { data: products, isLoading: isProductsLoading, isError: isProductsError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialData: [],
  });

  const { data: discount, isLoading: isDiscountLoading, isError: isDiscountError } = useQuery({
    queryKey: ['discount'],
    queryFn: fetchDiscount,
    initialData: null,
  });

  const { data: payment, isLoading: isPaymentLoading, isError: isPaymentError } = useQuery({
    queryKey: ['payment'],
    queryFn: fetchPayment,
    initialData: null,
  });

  const { mutate: orderSubmitMutate, isPending: isSubmitting } = useMutation({
    mutationFn: (orderData: OrderPayload) => submitOrder(orderData),
    onSuccess: () => {
      // 주문 성공 시 관련 쿼리 무효화 또는 다른 로직 처리
      queryClient.invalidateQueries({ queryKey: ['products'] });
      console.log('Order submitted successfully');
      // 예를 들어 성공 페이지로 리디렉션 할 수 있습니다.
      // router.push('/order/success');
    },
    onError: (error) => {
      console.error('Order submission failed:', error);
      // 에러 처리 로직 (예: 사용자에게 알림)
    },
  });

  const formMethods = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
  });

  const isLoading = isProductsLoading || isDiscountLoading || isPaymentLoading;
  const isError = isProductsError || isDiscountError || isPaymentError;

  return {
    ...formMethods,
    products,
    discount,
    payment,
    loading: isLoading,
    error: isError,
    orderSubmitMutate,
    isSubmitting,
  };
};

export default useOrderSheet;
