import { z } from 'zod';

// --- Data Shape Schemas (API 응답 및 화면 표시용) ---
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});
export const productListSchema = z.array(productSchema);

export const discountSchema = z.object({
  id: z.string(),
  name: z.string(),
  rate: z.number().min(0).max(1),
});

export const paymentSchema = z.object({
  id: z.string(),
  method: z.string(),
  amount: z.number(),
});

// --- Form State Schema (react-hook-form 관리용) ---
export const orderTypeSchema = z.enum(['STANDARD', 'OVERSEAS', 'ECOUPON']);

// 모든 주문 유형을 포괄하는 단일 폼 스키마
export const orderFormSchema = z.object({
    orderType: orderTypeSchema,
    orderCstNm: z.string().min(1, '주문자 이름은 필수입니다.'),
    orderMobilePhone: z.string().min(1, '주문자 휴대폰 번호는 필수입니다.'),
    productId: z.string().min(1, '상품을 선택해주세요.'),
    paymentId: z.string().min(1, '결제 수단을 선택해주세요.'),
    receiver: z.string().min(1, '받는 분 이름은 필수입니다.'),
    addr: z.string().optional(),
    customsId: z.string().optional(),
  })
  .refine((data) => {
    if (data.orderType === 'STANDARD' || data.orderType === 'OVERSEAS') {
      return data.addr && data.addr.length > 0;
    }
    return true;
  }, {
    message: '주소는 필수입니다.',
    path: ['addr'],
  })
  .refine((data) => {
    if (data.orderType === 'OVERSEAS') {
      return data.customsId && data.customsId.length > 0;
    }
    return true;
  }, {
    message: '개인통관고유부호는 필수입니다.',
    path: ['customsId'],
  });


// --- API Payload Schema (서버 전송용) ---
// payload 구성을 위한 개별 스키마는 유지합니다.
const baseOrderSchema = z.object({
  orderType: orderTypeSchema,
  orderCstNm: z.string(),
  orderMobilePhone: z.string(),
  productId: z.string(),
  paymentId: z.string(),
});
const standardOrderFormSchema = baseOrderSchema.extend({ orderType: z.literal('STANDARD'), receiver: z.string(), addr: z.string() });
const overseasOrderFormSchema = baseOrderSchema.extend({ orderType: z.literal('OVERSEAS'), receiver: z.string(), addr: z.string(), customsId: z.string() });
const ecouponOrderFormSchema = baseOrderSchema.extend({ orderType: z.literal('ECOUPON'), receiver: z.string() });

const standardOrderPayloadSchema = standardOrderFormSchema.extend({ product: productSchema, payment: paymentSchema, discount: discountSchema.nullable() });
const overseasOrderPayloadSchema = overseasOrderFormSchema.extend({ product: productSchema, payment: paymentSchema, discount: discountSchema.nullable() });
const ecouponOrderPayloadSchema = ecouponOrderFormSchema.extend({ product: productSchema, payment: paymentSchema, discount: discountSchema.nullable() });

export const orderPayloadSchema = z.discriminatedUnion('orderType', [standardOrderPayloadSchema, overseasOrderPayloadSchema, ecouponOrderPayloadSchema]);