'use client';

import React, { useEffect } from 'react';
import { UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import useOrderSheet from '@/features/order/hooks/useOrderSheet';
import PaymentInfo from '@/features/order/components/PaymentInfo';
import DiscountInfo from '@/features/order/components/DiscountInfo';
import ProductInfo from '@/features/order/components/ProductInfo';
import { orderPayloadSchema } from '@/features/order/order.schemas';
import { OrderFormValues, OrderType, OrderPayload } from '@/features/order/order.types';

interface FormComponentProps {
  register: UseFormRegister<OrderFormValues>;
  errors: FieldErrors<OrderFormValues>;
  control: Control<OrderFormValues>;
  orderType: OrderType;
}

const CommonFields = ({ register, errors }: Pick<FormComponentProps, 'register' | 'errors'>) => (
  <section className="p-4 border rounded-lg space-y-4">
    <h2 className="text-xl font-semibold">주문자 정보</h2>
    <div>
      <label htmlFor="orderCstNm" className="block mb-1">이름</label>
      <input id="orderCstNm" {...register('orderCstNm')} className="w-full p-2 border rounded" />
      {errors.orderCstNm && <p className="text-red-500 mt-1">{errors.orderCstNm.message}</p>}
    </div>
    <div>
      <label htmlFor="orderMobilePhone" className="block mb-1">휴대폰 번호</label>
      <input id="orderMobilePhone" {...register('orderMobilePhone')} className="w-full p-2 border rounded" />
      {errors.orderMobilePhone && <p className="text-red-500 mt-1">{errors.orderMobilePhone.message}</p>}
    </div>
  </section>
);

const DynamicFields = ({ register, errors, orderType }: FormComponentProps) => {
  return (
    <section className="p-4 border rounded-lg space-y-4">
      <h2 className="text-xl font-semibold">배송지 정보</h2>
      <div>
        <label htmlFor="receiver" className="block mb-1">받으시는 분</label>
        <input id="receiver" {...register('receiver')} className="w-full p-2 border rounded" />
        {errors.receiver && <p className="text-red-500 mt-1">{errors.receiver.message}</p>}
      </div>
      {orderType !== 'ECOUPON' && (
        <div>
          <label htmlFor="addr" className="block mb-1">주소</label>
          <input id="addr" {...register('addr')} className="w-full p-2 border rounded" />
          {errors.addr && <p className="text-red-500 mt-1">{errors.addr.message}</p>}
        </div>
      )}
      {orderType === 'OVERSEAS' && (
        <div>
          <label htmlFor="customsId" className="block mb-1">개인통관고유부호</label>
          <input id="customsId" {...register('customsId')} className="w-full p-2 border rounded" />
          {errors.customsId && <p className="text-red-500 mt-1">{errors.customsId.message}</p>}
        </div>
      )}
    </section>
  );
};

interface OrderFormProps {
  orderType: OrderType;
}

const OrderForm = ({ orderType }: OrderFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    products,
    discount,
    payment,
    loading,
    error,
    orderSubmitMutate,
    isSubmitting,
  } = useOrderSheet();

   useEffect(() => {
    setValue('orderType', orderType);
  }, [orderType, setValue]);

  const onFormSubmit = async (formValues: OrderFormValues) => {
    console.log("formValues", formValues);

    const selectedProduct = products?.find(p => p.id === formValues.productId);

    if (!selectedProduct || !payment) {
      alert('주문 정보를 완성할 수 없습니다. 다시 시도해주세요.');
      return;
    }

    const payload: OrderPayload = {
      ...formValues,
      product: selectedProduct,
      payment: payment,
      discount: discount,
    } as OrderPayload;

    try {

      orderPayloadSchema.parse(payload);

      /**
       ** 유효성 검사 실패하면 바로 form에서 감지하고 DynamicFields에서 에러 반한을 함에도 parse로 또 유효성 체크 하는 이유
       1. react-hook-form + zodResolver (orderFormSchema)

      * 목적: 사용자가 폼에 입력한 개별 필드들의 유효성을 검사하고, 그 결과를 폼 UI에 즉각적으로 반영하여 사용자에게 피드백을 주는 것입니다.
      * 대상: useForm에 연결된 orderFormSchema는 register로 연결된 input 필드들(예: orderCstNm, orderMobilePhone, productId 등)의 유효성을 검사합니다.
      * 동작: 사용자가 입력할 때마다 또는 폼 제출 시 react-hook-form이 orderFormSchema를 기반으로 각 필드를 검사하고, 에러가 있으면 formState.errors 객체에 해당 필드의 에러
        메시지를 담아줍니다. 이 에러 메시지를 DynamicFields나 ProductInfo 같은 컴포넌트에서 받아서 UI에 표시하는 것이죠.

      2. orderPayloadSchema.parse(payload)
      * 목적: 백엔드 API로 전송될 최종 `payload` 객체 전체의 유효성을 검사하는 것입니다. 이 payload는 단순히 폼 입력값뿐만 아니라, 다른 곳에서 가져온 데이터(예: products
        배열에서 찾은 selectedProduct 객체, discount 객체, payment 객체 등)가 결합된 형태입니다.
      * 대상: orderPayloadSchema는 OrderPayload 타입에 해당하는 전체 객체의 구조와 각 필드의 유효성을 검사합니다.
      * 동작: onFormSubmit 함수 내에서 react-hook-form이 제공하는 formValues와 React Query를 통해 가져온 products, discount, payment 등의 데이터를 조합하여 최종 payload
        객체를 만듭니다. orderPayloadSchema.parse(payload)는 이 최종 `payload` 객체가 백엔드가 기대하는 정확한 형태와 값을 가지고 있는지 마지막으로 확인하는 단계입니다.

      -------

      1. 데이터 조합의 유효성 검사: react-hook-form은 formValues만 검사합니다. 하지만 실제 API 요청에는 formValues 외에 selectedProduct (객체), discount (객체), payment (객체)
          등 폼 입력값에서 파생되거나 외부에서 가져온 데이터가 포함됩니다. 이 파생/조합된 데이터의 유효성까지 react-hook-form이 직접 검사하지는 않습니다.
          orderPayloadSchema.parse(payload)는 이 조합된 최종 객체 전체의 유효성을 보장합니다.
          * 예를 들어, productId는 폼에서 선택했지만, 해당 productId에 해당하는 selectedProduct 객체가 products 배열에 없어서 undefined가 될 수도 있습니다. orderPayloadSchema는
            product 필드가 Product 타입이어야 한다고 정의되어 있다면, selectedProduct가 undefined인 경우 여기서 에러를 던질 것입니다.
      2. 백엔드 API 계약 보장: orderPayloadSchema는 백엔드 API의 입력 스펙과 정확히 일치하도록 설계되었을 가능성이 높습니다. 프론트엔드에서 이 스키마를 통해 최종 payload를
          검증함으로써, 잘못된 데이터 형식으로 인해 백엔드에서 에러가 발생하는 것을 사전에 방지할 수 있습니다. 이는 네트워크 요청을 줄이고, 디버깅을 용이하게 하며, 시스템의
          안정성을 높입니다.
      3. 추가적인 비즈니스 로직 유효성: 때로는 폼 필드 개별로는 유효하지만, 여러 필드의 조합이나 특정 비즈니스 로직에 따라 유효하지 않은 경우가 있을 수 있습니다. 이러한
          복합적인 유효성 검사를 orderPayloadSchema에서 처리할 수 있습니다.
 */

 
        orderSubmitMutate(payload, {
          onSuccess: (result) => alert(`주문 성공! 주문번호: ${result.orderId}`),
          onError: (err) => {
            alert('주문 실패');
            console.error(err);
          }
        });
    } catch (err) {
        alert('주문 유효성 검사 실패');
        console.error(err);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">에러가 발생했습니다.</div>;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <CommonFields register={register} errors={errors} />
      <DynamicFields register={register} errors={errors} control={control} orderType={orderType} />
      <ProductInfo products={products || []} register={register} error={errors.productId} />
      <DiscountInfo discount={discount} />
      <PaymentInfo payment={payment} register={register} error={errors.paymentId} />
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400">
        {isSubmitting ? '결제 처리 중...' : '결제하기'}
      </button>
    </form>
  );
};

export default OrderForm;
