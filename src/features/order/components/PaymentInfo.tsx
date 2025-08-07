'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { Payment, OrderFormValues } from '@/features/order/order.types';

interface PaymentInfoProps {
  payment: Payment | null;
  register: UseFormRegister<OrderFormValues>;
  error?: FieldError;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ payment, register, error }) => {
  if (!payment) return null;

  return (
    <section className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">결제 정보</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>총 상품금액</span>
          <span>{payment.amount.toLocaleString()}원</span>
        </div>
        {/* 할인 금액 등 추가 정보가 있다면 여기에 표시 */}
        <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
          <span>최종 결제금액</span>
          <span>{payment.amount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">결제 수단 선택</h3>
        <label className="flex items-center p-2 border rounded-md hover:bg-gray-50">
          <input 
            type="radio" 
            value={payment.id} 
            {...register('paymentId')} 
            className="mr-4"
          />
          <span>{payment.method}</span>
        </label>
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </div>
    </section>
  );
};

export default PaymentInfo;
