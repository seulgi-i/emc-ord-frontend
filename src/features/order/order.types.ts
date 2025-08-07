import { z } from 'zod';
import {
  productSchema,
  discountSchema,
  paymentSchema,
  orderTypeSchema,
  orderPayloadSchema,
  orderFormSchema,
} from './order.schemas';

export type Product = z.infer<typeof productSchema>;
export type Discount = z.infer<typeof discountSchema>;
export type Payment = z.infer<typeof paymentSchema>;

export type OrderType = z.infer<typeof orderTypeSchema>;

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export type OrderPayload = z.infer<typeof orderPayloadSchema>;
