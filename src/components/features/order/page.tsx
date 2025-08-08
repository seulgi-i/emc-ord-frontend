'use client';

import React from 'react';
import OrderForm from '@/components/features/order/components/OrderForm';
import { OrderType } from '@/components/features/order/order.types';

const OrderPage = ({orderType = 'O'} : {orderType: OrderType}) => {
  let orderTitle = '';

  switch (orderType) {
    case 'G':
      orderTitle = '주문서';
      break;
    case 'O':
      orderTitle = '해외 직구 주문서';
      break;
    case 'E':
      orderTitle = 'E-COUPON 주문서';
      break;
    default:
      orderTitle = '주문서';
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{orderTitle}</h1>
      <OrderForm orderType={orderType} />
    </div>
  );
};

export default OrderPage;
