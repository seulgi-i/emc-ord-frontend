import apiClient from "@/lib/api/apiClient";
import { productListSchema } from "@/lib/schemas/order.schemas";
import { Product } from "../../order/order.types";

// 상품 목록 조회 API
export const fetchProducts = (): Promise<Product[]> => {
    return apiClient('/api/order/products', {}, productListSchema);
};
