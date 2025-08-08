import apiClient from "@/lib/api/apiClient";
import { discountSchema } from "@/lib/schemas/order.schemas";
import { Discount } from "../../order/order.types";


// 할인 정보 조회 API
export const fetchDiscount = (): Promise<Discount> => {
  return apiClient('/api/order/discount', {}, discountSchema);
};
