import { fetchProducts, fetchDiscount, fetchPayment, submitOrder } from '@/components/features/order/api/orderApi'
import { OrderPayload } from '@/components/features/order/order.types'
import { useGlobalUIStore } from '@/lib/stores/globalUIStore'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

const useOrderData = () => {
  const { setGlobalLoading } = useGlobalUIStore()

  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  })

  const {
    data: discount,
    isLoading: isDiscountLoading,
    isError: isDiscountError,
  } = useQuery({
    queryKey: ['discount'],
    queryFn: fetchDiscount,
    initialData: null,
  })

  const {
    data: payment,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useQuery({
    queryKey: ['payment'],
    queryFn: fetchPayment,
    initialData: null,
  })

  const { mutate: orderSubmitMutate, isPending: isSubmitting } = useMutation({
    mutationFn: (orderData: OrderPayload) => submitOrder(orderData),
    onSuccess: () => {
      // 주문 성공 시 관련 쿼리 무효화  또는 다른 로직 처리
      console.log('Order submitted successfully')
      // 예를 들어 성공 페이지로 리디렉션 할 수 있습니다.
      // router.push('/order/success');
    },
    onError: (error) => {
      console.error('Order submission failed:', error)
      // 에러 처리 로직 (예: 사용자에게 알림)
    },
  })

  const isLoading =
    isProductsLoading || isDiscountLoading || isPaymentLoading || isSubmitting
  const isError = isProductsError || isDiscountError || isPaymentError

  useEffect(() => {
    setGlobalLoading(isLoading)
  }, [isLoading, setGlobalLoading])

  return {
    products,
    discount,
    payment,
    isLoading,
    isError,
    orderSubmitMutate,
  }
}

export default useOrderData
