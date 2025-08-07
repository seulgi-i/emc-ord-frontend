'use client';

import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { Product, OrderFormValues } from '@/features/order/order.types';

interface ProductInfoProps {
  products: Product[];
  register: UseFormRegister<OrderFormValues>;
  error?: FieldError;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ products, register, error }) => {
  return (
    <section className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">주문 상품 정보</h2>
      <div className="space-y-2">
        {products.map((product) => (
          <label key={product.id} className="flex items-center p-2 border rounded-md hover:bg-gray-50">
            <input
              type="radio"
              value={product.id}
              {...register('productId')}
              className="mr-4"
            />
            <div className="flex-grow">
              <span className="font-medium">{product.name}</span>
              <p className="text-gray-600">{product.price.toLocaleString()}원</p>
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 mt-2">{error.message}</p>}
    </section>
  );
};

export default ProductInfo;
