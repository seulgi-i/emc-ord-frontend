import { fetchOrder, submitOrder } from '@/components/features/order/api/orderApi'
import { OrderPayload } from '@/components/features/order/order.types'
import { useMutation, useQuery } from '@tanstack/react-query'

interface SubmitOrderVariables {
  orderData: OrderPayload;
  loadingMessage?: string;
}

const useOrderData = () => {
  // 3개의 useQuery를 하나로 통합하고 fetchOrder를 사용합니다.
  const { 
    data: initialData, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['order', 'initialData'],
    queryFn: () => fetchOrder({ loadingMessage: '주문 정보를 불러오고 있습니다...' }),
  });

  // fetchOrder는 [products, discount, payment] 형태의 배열을 반환합니다.
  const [products, discount, payment] = initialData || [[], null, null];

  const { mutate: orderSubmitMutate, isPending: isSubmitting } = useMutation({
    mutationFn: ({ orderData, loadingMessage = '주문 요청중입니다...' }: SubmitOrderVariables) => 
      submitOrder(orderData, loadingMessage),
    onSuccess: () => {
      console.log('Order submitted successfully')
    },
    onError: (error) => {
      console.error('Order submission failed:', error)
    },
  });

  return {
    products,
    discount,
    payment,
    isLoading,
    isError,
    isSubmitting,
    orderSubmitMutate,
  }
}

export default useOrderData;