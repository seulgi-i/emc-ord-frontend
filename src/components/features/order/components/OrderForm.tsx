'use client'

import React, { useEffect, useState } from 'react'
import { UseFormRegister, FieldErrors, Control, useWatch, useForm } from 'react-hook-form'
import { OrderFormValues, OrderType, OrderPayload } from '@/components/features/order/order.types'
import useOrderData from '@/hooks/useOrderData'
import { zodResolver } from '@hookform/resolvers/zod'

import InputField from '@/components/ui/InputField'
import router from 'next/router'
import { orderFormSchema, orderPayloadSchema } from '@/lib/schemas/order.schemas'
import AddressListModal from './AddressListModal' // Import the new modal
import ProductInfo from './ProductInfo'
import DiscountInfo from './DiscountInfo'
import PaymentInfo from './PaymentInfo'

interface FormComponentProps {
  register: UseFormRegister<OrderFormValues>
  errors: FieldErrors<OrderFormValues>
  control: Control<OrderFormValues>
  orderType: OrderType
}

const CommonFields = ({ register, errors }: Pick<FormComponentProps, 'register' | 'errors'>) => (
  <section className="p-4 border rounded-lg space-y-4">
    <h2 className="text-xl font-semibold">주문자 정보</h2>
    <InputField<OrderFormValues> id="orderCstNm" label="이름" register={register} error={errors} />
    <InputField<OrderFormValues> id="orderMobilePhone" label="휴대폰 번호" register={register} error={errors} />
  </section>
)

const DynamicFields = ({ register, errors, orderType }: FormComponentProps) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  return (
    <section className="p-4 border rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">배송지 정보</h2>
      <InputField<OrderFormValues> id="receiver" label="받으시는 분" register={register} error={errors} />
      {orderType !== 'E' && (
        <InputField<OrderFormValues> id="addr" label="주소" register={register} error={errors} />
      )}
      {orderType === 'O' && (
        <InputField<OrderFormValues> id="customsId" label="개인통관고유부호" register={register} error={errors} />
      )}
      <button
        type="button"
        onClick={handleOpenAddressModal}
        className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
      >
        배송지 관리
      </button>

      <AddressListModal
        isOpen={isAddressModalOpen}
        onClose={handleCloseAddressModal}
      />
    </section>
  )
}

interface OrderFormProps {
  orderType: OrderType
}

const OrderForm = ({ orderType }: OrderFormProps) => {
  const { products, discount, payment, isLoading, isError, orderSubmitMutate } = useOrderData()
  
  const methods = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    defaultValues: {
      orderCstNm: '',
      orderMobilePhone: '',
      productId: '',
      paymentId: '',
      receiver: '',
      addr: '',
      customsId: '',
      orderType: orderType,
    },
  })

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, setValue } = methods

  // productId를 watch하여 선택된 상품을 동적으로 가져옴
  const watchedProductId = useWatch({
    control,
    name: 'productId',
  })

  const selectedProduct = products?.find(p => p.id === watchedProductId)

  useEffect(() => {
    setValue('orderType', orderType)
  }, [orderType, setValue])

  const onFormSubmit = async (formValues: OrderFormValues) => {
    console.log('formValues', formValues)

    if (!selectedProduct || !payment) {
      alert('주문 정보를 완성할 수 없습니다. 다시 시도해주세요.')
      return
    }

    try {
      // 최종 payload 구성
      let payload: OrderPayload;

      const commonPayload = {
        orderCstNm: formValues.orderCstNm,
        orderMobilePhone: formValues.orderMobilePhone,
        receiver: formValues.receiver,
        product: [selectedProduct],
        payment: payment!,
        discount: discount!,
      };

      switch (formValues.orderType) {
        case 'G':
          payload = {
            ...commonPayload,
            orderType: 'G',
            addr: formValues.addr!,
          };
          break;
        case 'O':
          payload = {
            ...commonPayload,
            orderType: 'O',
            addr: formValues.addr!,
            customsId: formValues.customsId!,
          };
          break;
        case 'E':
          payload = {
            ...commonPayload,
            orderType: 'E',
          };
          break;
        default:
          throw new Error('알 수 없는 주문 유형입니다.');
      }

      // 백엔드 API 스펙에 맞는 최종 유효성 검사
      const validatedPayload = orderPayloadSchema.parse(payload)

      // mutation을 사용하여 주문 제출
      orderSubmitMutate(validatedPayload, {
        onSuccess: (result) => {
          console.log('주문이 성공적으로 제출되었습니다:', result)
          alert('주문이 완료되었습니다!')
          // 성공 시 추가 로직 (예: 성공 페이지로 리디렉션)
          router.push('/order/complete')
        },
        onError: (error) => {
          console.error('주문 제출 실패:', error)
          alert('주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
        },
      })
    } catch (validationError) {
      console.error('주문 유효성 검사 실패:', validationError)
      alert('주문 정보가 올바르지 않습니다. 입력 내용을 확인해 주세요.')
    }
  }

  if (isLoading) return 
  if (isError) return <div className="text-red-500 text-center p-8">에러가 발생했습니다.</div>

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <CommonFields register={register} errors={errors} />
      <DynamicFields register={register} errors={errors} control={control} orderType={orderType} />
      <ProductInfo 
        data={products || []} 
        register={register} 
        error={errors.productId} 
      />
      <DiscountInfo data={discount || null} />
      <PaymentInfo 
        data={payment || null} 
        selectedProduct={selectedProduct} 
        discount={discount || null} 
        register={register} 
        error={errors.paymentId} 
      />
      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400"
      >
        {isSubmitting ? '결제 처리 중...' : '결제하기'}
      </button>
    </form>
  )
}

export default OrderForm

