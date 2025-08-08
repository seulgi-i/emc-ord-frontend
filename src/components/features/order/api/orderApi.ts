import apiClient from "@/lib/api/apiClient";
import { OrderPayload } from "../order.types";
import { Product, Discount, Payment } from "../order.types";
import { productListSchema, discountSchema, paymentSchema, orderPayloadSchema } from "@/lib/schemas/order.schemas";
import { Address, AddressFormValues, AddressPagination } from "@/lib/types/address.types";
import { addressSchema, addressPaginationSchema } from "@/lib/schemas/address.schemas";

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

// 주문 제출 API
export const submitOrder = (orderData: OrderPayload): Promise<{ orderId: string }> => {
    return apiClient('/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(orderData),
    });
};

// 배송지 목록 조회 API (페이지네이션 포함)
export const fetchAddresses = (page: number = 1, pageSize: number = 5): Promise<AddressPagination> => {
  return apiClient(`/api/order/addresses?page=${page}&pageSize=${pageSize}`, {}, addressPaginationSchema);
};

// 배송지 추가 API
export const addAddress = (address: AddressFormValues): Promise<Address> => {
  return apiClient('/api/order/addresses', {
    method: 'POST',
    body: JSON.stringify(address),
  }, addressSchema);
};

// 배송지 수정 API
export const updateAddress = (id: string, address: AddressFormValues): Promise<Address> => {
  return apiClient(`/api/order/addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(address),
  }, addressSchema);
};

// 배송지 삭제 API
export const deleteAddress = (id: string): Promise<void> => {
  return apiClient(`/api/order/addresses/${id}`, {
    method: 'DELETE',
  });
};