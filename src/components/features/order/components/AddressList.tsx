'use client';

import React, { useState } from 'react';
import { Address } from '@/lib/schemas/address.schemas';
import useAddresses from '@/hooks/useAddresses';
import AddressFormModal from './AddressFormModal';
import AddressEditModal from './AddressEditModal';

interface AddressListProps {
  onSelectAddress?: (address: Address) => void;
  showSelection?: boolean;
}

const AddressList: React.FC<AddressListProps> = ({ 
  onSelectAddress, 
  showSelection = false 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const { 
    addresses, 
    totalAddresses, 
    pageSize, 
    isLoading, 
    isError, 
    deleteAddress,
    isDeleting 
  } = useAddresses({ page: currentPage, pageSize: 5 });

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm('정말로 이 배송지를 삭제하시겠습니까?')) {
      deleteAddress(id);
    }
  };

  const handleSelectAddress = (address: Address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">로딩 중...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center p-8">배송지를 불러오는데 실패했습니다.</div>;
  }

  const totalPages = Math.ceil(totalAddresses / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">배송지 목록</h2>
        <button
          onClick={handleAddAddress}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          새 배송지 추가
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          등록된 배송지가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${
                address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{address.receiver}</span>
                    {address.isDefault && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        기본 배송지
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{address.phone}</p>
                  <p className="text-gray-800">
                    ({address.zipCode}) {address.addr}
                  </p>
                </div>
                
                <div className="flex gap-2 ml-4">
                  {showSelection && (
                    <button
                      onClick={() => handleSelectAddress(address)}
                      className="bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600"
                    >
                      선택
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="bg-gray-500 text-white px-3 py-1 text-sm rounded hover:bg-gray-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isDeleting}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400"
          >
            이전
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400"
          >
            다음
          </button>
        </div>
      )}

      {/* 배송지 추가/수정 모달 */}
      <AddressEditModal
        isOpen={isModalOpen}
        onClose={closeModal}
        address={editingAddress}
      />
    </div>
  );
};

export default AddressList;
