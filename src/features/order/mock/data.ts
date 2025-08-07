import { Product, Discount, Payment } from "../order.types";

export const mockProducts: Product[] = [
  {
    id: '1',
    name: '프리미엄 커피 원두 500g',
    price: 25000,
  },
  {
    id: '2',
    name: '유기농 허브 티 세트',
    price: 18000,
  },
  {
    id: '3',
    name: '스테인리스 텀블러',
    price: 15000,
  },
];

export const mockDiscount: Discount = {
  id: '1',
  name:"첫 구매 할인",
  rate: 0.05,
};

export const mockPayment: Payment = {
  id: '1',
  method: '신용카드',
  amount: 0, 
};