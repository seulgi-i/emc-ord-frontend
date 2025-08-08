'use client';

import React from 'react';
import { Discount } from '../order.types';

interface DiscountInfoProps {
  data: Discount | null;
}

const DiscountInfo: React.FC<DiscountInfoProps> = ({ data }) => {
  if (!data) return null;

  return (
    <section className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-2">할인 정보</h2>
      <div className="flex justify-between items-center">
        <span className="font-medium">{data.name}</span>
        <span className="text-red-500 font-bold">-{data.rate * 100}%</span>
      </div>
    </section>
  );
};

export default DiscountInfo;
