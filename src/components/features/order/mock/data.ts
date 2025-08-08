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

import { Address } from "@/lib/types/address.types";

export const mockPayment: Payment = {
  id: '1',
  method: '신용카드',
  amount: 0, 
};

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    receiver: '김철수',
    addr: '서울시 강남구 테헤란로 123',
    zipCode: '06130',
    phone: '01012345678',
    isDefault: true,
  },
  {
    id: 'addr-2',
    receiver: '이영희',
    addr: '부산시 해운대구 센텀중앙로 45',
    zipCode: '48059',
    phone: '01098765432',
    isDefault: false,
  },
  {
    id: 'addr-3',
    receiver: '박민수',
    addr: '대구시 중구 동성로 100',
    zipCode: '41940',
    phone: '01011112222',
    isDefault: false,
  },
  {
    id: 'addr-4',
    receiver: '최지영',
    addr: '인천시 연수구 송도과학로 50',
    zipCode: '22000',
    phone: '01033334444',
    isDefault: false,
  },
  {
    id: 'addr-5',
    receiver: '정우성',
    addr: '광주시 서구 상무중앙로 70',
    zipCode: '61945',
    phone: '01055556666',
    isDefault: false,
  },
];