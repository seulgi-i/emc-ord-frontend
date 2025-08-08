import { paymentListSchema } from "@/features/order/order.schemas";
import { Payment } from "@/features/order/order.types";
import apiClient from "@/lib/apiClient";

// 결제 정보 조회 API
export const fetchPayment = (): Promise<Payment[]> => {
  return apiClient('/api/order/payment', {}, paymentListSchema);
};
