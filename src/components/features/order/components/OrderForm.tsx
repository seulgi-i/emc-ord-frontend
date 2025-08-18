'use client'

import { OrderFormValues, OrderPayload, OrderType } from '@/components/features/order/order.types'
import useOrderData from '@/hooks/useOrderData'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { Control, FormProvider, useForm } from 'react-hook-form'

import InputField from '@/components/ui/InputField'
import { orderFormSchema } from '@/lib/schemas/order.schemas'
import { useRouter } from 'next/navigation'
import AddressListModal from './AddressListModal'
import DiscountInfo from './DiscountInfo'
import PaymentInfo from './PaymentInfo'
import ProductInfo from './ProductInfo'

interface FormComponentProps {
    control: Control<OrderFormValues>
    orderType?: OrderType
}

const CommonFields = ({ control }: FormComponentProps) => (
    <section className="p-4 border rounded-lg space-y-4">
        <h2 className="text-xl font-semibold">주문자 정보</h2>
        <InputField<OrderFormValues> control={control} id="orderCstNm" label="이름" />
        <InputField<OrderFormValues>
            control={control}
            id="orderMobilePhone"
            label="휴대폰 번호"
            type="tel"
            inputProps={{ maxLength: 11 }}
        />
    </section>
)

const DynamicFields = ({ orderType, control }: FormComponentProps) => {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)

    const handleOpenAddressModal = () => {
        setIsAddressModalOpen(true)
    }

    const handleCloseAddressModal = () => {
        setIsAddressModalOpen(false)
    }

    return (
        <section className="p-4 border rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">배송지 정보</h2>
            <InputField<OrderFormValues> control={control} id="receiver" label="받는 분" />
            {orderType !== 'E' && <InputField<OrderFormValues> control={control} id="addr" label="주소" />}
            {orderType === 'O' && (
                <InputField<OrderFormValues> control={control} id="customsId" label="개인통관고유부호" />
            )}
            <button
                type="button"
                onClick={handleOpenAddressModal}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
                배송지 관리
            </button>

            <AddressListModal isOpen={isAddressModalOpen} onClose={handleCloseAddressModal} />
        </section>
    )
}

interface OrderFormProps {
    orderType: OrderType
}

const OrderForm = ({ orderType }: OrderFormProps) => {
    const { products, discount, payment, isLoading, isError, isSubmitting, orderSubmitMutate } = useOrderData()
    const router = useRouter()

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

    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        control,
        register,
    } = methods

    const watchedProductId = watch('productId')

    const selectedProduct = products?.find((p) => p.id === watchedProductId)

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
            let payload: OrderPayload
            const commonPayload = {
                orderCstNm: formValues.orderCstNm,
                orderMobilePhone: formValues.orderMobilePhone,
                receiver: formValues.receiver,
                product: [selectedProduct],
                payment: payment!,
                discount: discount!,
            }

            switch (formValues.orderType) {
                case 'G':
                    payload = { ...commonPayload, orderType: formValues.orderType, addr: formValues.addr! }
                    break
                case 'O':
                    payload = {
                        ...commonPayload,
                        orderType: formValues.orderType,
                        addr: formValues.addr!,
                        customsId: formValues.customsId!,
                    }
                    break
                case 'E':
                    payload = { ...commonPayload, orderType: formValues.orderType }
                    break
                default:
                    throw new Error('알 수 없는 주문 유형입니다.')
            }

            orderSubmitMutate(
                {
                    orderData: payload,
                    loadingMessage: '결제를 진행하고 있습니다...',
                },
                {
                    onSuccess: (result) => {
                        console.log('주문이 성공적으로 제출되었습니다:', result)
                        alert('주문이 완료되었습니다!')
                        router.push('/order/complete')
                    },
                    onError: (error) => {
                        console.error('주문 제출 실패:', error)
                        alert('주문 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
                    },
                },
            )
        } catch (validationError) {
            console.error('주문 유효성 검사 실패:', validationError)
            alert('주문 정보가 올바르지 않습니다. 입력 내용을 확인해 주세요.')
        }
    }

    if (isLoading) return null
    if (isError) return <div className="text-red-500 text-center p-8">에러가 발생했습니다.</div>

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
                <CommonFields control={control} />
                <DynamicFields orderType={orderType} control={control} />

                {/* These components still use register, which is fine */}
                <ProductInfo data={products || []} register={register} error={errors.productId} />
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
        </FormProvider>
    )
}

export default OrderForm
