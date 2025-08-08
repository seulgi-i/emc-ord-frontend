'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { Discount, OrderFormValues, Payment, Product } from '../order.types';

interface PaymentInfoProps {
  data: Payment | null;
  selectedProduct: Product | undefined;
  discount: Discount | null;
  register: UseFormRegister<OrderFormValues>;
  error?: FieldError;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ data, selectedProduct, discount, register, error }) => {
  if (!data) return null;

  const totalProductAmount = selectedProduct ? selectedProduct.price : 0;
  const discountAmount = discount && totalProductAmount > 0 ? totalProductAmount * discount.rate : 0;
  const finalPaymentAmount = totalProductAmount - discountAmount;

  return (
    <section className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">결제 정보</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>총 상품금액</span>
          <span>{totalProductAmount.toLocaleString()}원</span>
        </div>
        {discount && discountAmount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>{discount.name} ({discount.rate * 100}%)</span>
            <span>-{discountAmount.toLocaleString()}원</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>최종 결제금액</span>
          <span>{finalPaymentAmount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">결제 수단 선택</h3>
        <label className="flex items-center p-2 border rounded-md hover:bg-gray-50">
          <input 
            type="radio" 
            value={data.id} 
            {...register('paymentId')} 
            className="mr-4"
          />
          <span>{data.method}</span>
        </label>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </section>
  );
};

export default PaymentInfo;
