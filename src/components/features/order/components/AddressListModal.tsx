'use client';

import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import useAddresses from '@/hooks/useAddresses';
import { Address } from '@/lib/schemas/address.schemas';
import AddressFormModal from './AddressFormModal';

interface AddressListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddressListModal: React.FC<AddressListModalProps> = ({ isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const { addresses, totalAddresses, isLoading, isError, deleteAddress } = useAddresses({
    page: currentPage,
    pageSize: 5,
  });

  const totalPages = Math.ceil(totalAddresses / 5);

  const handleEdit = (address: Address) => {
    setSelectedAddress(address);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말로 이 배송지를 삭제하시겠습니까?')) {
      deleteAddress(id);
    }
  };

  const handleAdd = () => {
    setSelectedAddress(null); // Clear selected address for add mode
    setIsFormModalOpen(true);
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setSelectedAddress(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="배송지 관리" size="lg">
      <div className="space-y-4">
        {isLoading && <div className="text-center">배송지 목록 로딩 중...</div>}
        {isError && <div className="text-center text-red-500">배송지 목록을 불러오는데 실패했습니다.</div>}

        {!isLoading && addresses.length === 0 && (
          <div className="text-center text-gray-500">등록된 배송지가 없습니다.</div>
        )}

        {addresses.map((address) => (
          <div key={address.id} className="border p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-grow">
              <p className="font-semibold">{address.receiver} ({address.phone})</p>
              <p className="text-gray-600">({address.zipCode}) {address.addr}</p>
              {address.isDefault && <span className="text-blue-500 text-sm">[기본 배송지]</span>}
            </div>
            <div className="mt-2 md:mt-0 md:ml-4 flex space-x-2">
              <button
                onClick={() => handleEdit(address)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              >
                수정
              </button>
              <button
                onClick={() => handleDelete(address.id!)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                삭제
              </button>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              이전
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              다음
            </button>
          </div>
        )}

        <button
          onClick={handleAdd}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mt-4"
        >
          새 배송지 추가
        </button>
      </div>

      <AddressFormModal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
      />
    </Modal>
  );
};

export default AddressListModal;
