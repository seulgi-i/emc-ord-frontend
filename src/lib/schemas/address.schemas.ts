import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string(), 
  receiver: z.string().min(1, '받는 분 이름은 필수입니다.'),
  addr: z.string().min(1, '주소는 필수입니다.'),
  zipCode: z.string().min(1, '우편번호는 필수입니다.'),
  phone: z.string().regex(/^\d{10,11}$/, '유효한 휴대폰 번호 형식이 아닙니다. (10-11자리 숫자)'),
  isDefault: z.boolean().optional()
});

export const addressListSchema = z.array(addressSchema);

export const addressPaginationSchema = z.object({
  data: z.array(addressSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
export type Address = z.infer<typeof addressSchema>;
export type AddressList = z.infer<typeof addressListSchema>;
export type AddressPagination = z.infer<typeof addressPaginationSchema>;
