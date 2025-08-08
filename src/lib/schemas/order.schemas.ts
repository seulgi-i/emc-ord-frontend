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
export const paymentListSchema = z.array(paymentSchema);


// --- Form State Schema (react-hook-form 관리용) ---
// G:일반 주문서, O:해외, E:쿠폰
export const orderTypeSchema = z.enum(['G', 'O', 'E']);

// 모든 주문 유형을 포괄하는 단일 폼 스키마
export const orderFormSchema = z.object({
    orderType: orderTypeSchema,
    orderCstNm: z.string().min(1, '주문자 이름은 필수입니다.'),
    orderMobilePhone: z.string().regex(/^\d{10,11}$/, '유효한 휴대폰 번호 형식이 아닙니다. (10-11자리 숫자)'),
    productId: z.string().min(1, '상품을 선택해주세요.'),
    paymentId: z.string().min(1, '결제 수단을 선택해주세요.'),
    receiver: z.string().min(1, '받는 분 이름은 필수입니다.'),
    addr: z.string().optional(),
    customsId: z.string().optional(),
  })
  .refine((data) => {
    if (data.orderType === 'G' || data.orderType === 'O') {
      return data.addr && data.addr.length > 0;
    }
    return true;
  }, {
    message: '주소는 필수입니다.',
    path: ['addr'],
  })
  .refine((data) => {
    if (data.orderType === 'O') {
      return data.customsId && data.customsId.length > 0;
    }
    return true;
  }, {
    message: '개인통관고유부호는 필수입니다.',
    path: ['customsId'],
  });


// --- API Payload Schema (서버 전송용) ---
// payload 구성을 위한 개별 스키마는 유지합니다.
// payload 구성을 위한 개별 스키마는 유지합니다.
const baseOrderPayloadCoreSchema = z.object({
  orderType: orderTypeSchema,
  orderCstNm: z.string(),
  orderMobilePhone: z.string(),
});

const standardOrderPayloadSpecificSchema = baseOrderPayloadCoreSchema.extend({ orderType: z.literal('G'), receiver: z.string(), addr: z.string() });
const overseasOrderPayloadSpecificSchema = baseOrderPayloadCoreSchema.extend({ orderType: z.literal('O'), receiver: z.string(), addr: z.string(), customsId: z.string() });
const ecouponOrderPayloadSpecificSchema = baseOrderPayloadCoreSchema.extend({ orderType: z.literal('E'), receiver: z.string() });

const standardOrderPayloadSchema = standardOrderPayloadSpecificSchema.extend({ product: productListSchema, payment: paymentSchema, discount: discountSchema.nullable() });
const overseasOrderPayloadSchema = overseasOrderPayloadSpecificSchema.extend({ product: productListSchema, payment: paymentSchema, discount: discountSchema.nullable() });
const ecouponOrderPayloadSchema = ecouponOrderPayloadSpecificSchema.extend({ product: productListSchema, payment: paymentSchema, discount: discountSchema.nullable() });

export const orderPayloadSchema = z.discriminatedUnion('orderType', [standardOrderPayloadSchema, overseasOrderPayloadSchema, ecouponOrderPayloadSchema]);