import { discountSchema, orderFormSchema, orderPayloadSchema, orderTypeSchema, paymentSchema, productSchema } from '@/lib/schemas/order.schemas';
import { z } from 'zod';

export type Product = z.infer<typeof productSchema>;
export type Discount = z.infer<typeof discountSchema>;
export type Payment = z.infer<typeof paymentSchema>;

export type OrderType = z.infer<typeof orderTypeSchema>;

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
