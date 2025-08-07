import apiClient from '@/lib/apiClient';
import { OrderPayload } from '@/features/order/order.types';
import {
  productListSchema,
  discountSchema,
  paymentSchema,
} from '@/features/order/order.schemas';
import { Product, Discount, Payment } from '@/features/order/order.types';

// 상품 목록 조회 API
export const fetchProducts = (): Promise<Product[]> => {
  return apiClient('/api/order/products', {}, productListSchema);
};

// 할인 정보 조회 API
export const fetchDiscount = (): Promise<Discount> => {
  return apiClient('/api/order/discount', {}, discountSchema);
};

// 결제 정보 조회 API
export const fetchPayment = (): Promise<Payment> => {
  return apiClient('/api/order/payment', {}, paymentSchema);
};

// 주문서 제출 API
export const submitOrder = (orderData: OrderPayload): Promise<{ orderId: string }> => {
  return apiClient('/api/order/submit', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};