'use client';

import React from 'react';
import AddressList from '@/components/features/order/components/AddressList';

const AddressDemo = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">배송지 관리</h1>
      <AddressList showSelection={false} />
    </div>
  );
};

export default AddressDemo;
