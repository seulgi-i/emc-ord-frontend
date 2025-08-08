import { z } from 'zod';
import { addressSchema, addressPaginationSchema } from '../schemas/address.schemas';

export type Address = z.infer<typeof addressSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
export type AddressPagination = z.infer<typeof addressPaginationSchema>;
