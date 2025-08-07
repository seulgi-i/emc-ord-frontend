'use client';

import React from 'react';
import OrderForm from '@/features/order/components/OrderForm';
import { OrderType } from '@/features/order/order.types';

const OrderPage = () => {
  const currentOrderType: OrderType = 'OVERSEAS'; // 예시로 OVERSEAS를 하드코딩

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">주문서 작성 ({currentOrderType})</h1>
      <OrderForm orderType={currentOrderType} />
    </div>
  );
};

export default OrderPage;
