'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import useAddresses from '@/hooks/useAddresses';
import { Address } from '@/lib/schemas/address.schemas';

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress?: (address: Address) => void;
  selectedAddressId?: string;
}

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  isOpen,
  onClose,
  onSelectAddress,
  selectedAddressId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { 
    addresses, 
    totalAddresses, 
    isLoading, 
    isError, 
    deleteAddress,
    isDeleting 
  } = useAddresses({ page: currentPage, pageSize });

  const handleSelectAddress = (address: Address) => {
    if (onSelectAddress) {
      onSelectAddress(address);
    }
    onClose();
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm('정말로 이 배송지를 삭제하시겠습니까?')) {
      deleteAddress(id);
    }
  };

  const totalPages = Math.ceil(totalAddresses / pageSize);

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="배송지 선택" size="lg">
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">배송지 목록을 불러오는 중...</div>
        </div>
      </Modal>
    );
  }

  if (isError) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="배송지 선택" size="lg">
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">배송지 목록을 불러오는데 실패했습니다.</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="배송지 선택" size="lg">
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            등록된 배송지가 없습니다.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddressId === address.id
                    ? 'border-blue-500 bg-blue-50'
                    : address.isDefault
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleSelectAddress(address)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{address.receiver}</span>
                      {address.isDefault && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                          기본 배송지
                        </span>
                      )}
                      {selectedAddressId === address.id && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          선택됨
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{address.phone}</p>
                    <p className="text-gray-800 text-sm">
                      ({address.zipCode}) {address.addr}
                    </p>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddress(address.id);
                    }}
                    disabled={isDeleting}
                    className="ml-4 text-red-500 hover:text-red-700 text-sm underline disabled:text-gray-400"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-4 border-t">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
            >
              이전
            </button>
            
            <span className="px-3 py-1 text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        )}

        {/* 닫기 버튼 */}
        <div className="pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            닫기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddressFormModal;
