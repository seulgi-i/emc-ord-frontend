'use client';

import React, { useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import InputField from '@/components/ui/InputField';
import { useForm, SubmitHandler, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addressSchema, AddressFormValues, Address } from '@/lib/schemas/address.schemas';
import useAddresses from '@/hooks/useAddresses';

interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  address?: Address | null;
}

const AddressEditModal: React.FC<AddressEditModalProps> = ({
  isOpen,
  onClose,
  address,
}) => {
  const { addAddress, updateAddress, isAdding, isUpdating } = useAddresses();

  const methods = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      id: "",
      receiver: '',
      addr: '',
      zipCode: '',
      phone: '',
      isDefault: false,
    },
  });

  const { control, register, handleSubmit, formState: { errors }, reset } = methods;

  useEffect(() => {
    if (address) {
      reset({
        id: address.id,
        receiver: address.receiver,
        addr: address.addr,
        zipCode: address.zipCode,
        phone: address.phone,
        isDefault: Boolean(address.isDefault),
      });
    } else {
      reset({
        id: '',
        receiver: '',
        addr: '',
        zipCode: '',
        phone: '',
        isDefault: false,
      });
    }
  }, [address, reset]);

  const onSubmit: SubmitHandler<AddressFormValues> = (data) => {
    const submitData: AddressFormValues = {
      ...data,
      isDefault: Boolean(data.isDefault),
    };

    if (address?.id) {
      // Edit existing address
      updateAddress({ id: address.id, data: submitData }, {
        onSuccess: () => {
          alert('배송지가 수정되었습니다.');
          onClose();
        },
        onError: (error) => {
          console.error('배송지 수정 실패:', error);
          alert('배송지 수정에 실패했습니다.');
        },
      });
    } else {
      // Add new address
      addAddress(submitData, {
        onSuccess: () => {
          alert('새 배송지가 추가되었습니다.');
          onClose();
        },
        onError: (error) => {
          console.error('배송지 추가 실패:', error);
          alert('새 배송지 추가에 실패했습니다.');
        },
      });
    }
  };

  const title = address ? '배송지 수정' : '새 배송지 추가';
  const isSubmitting = isAdding || isUpdating;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField<AddressFormValues> id="receiver" label="받는 분 이름" control={control} />
        <InputField<AddressFormValues> id="phone" label="휴대폰 번호" control={control} />
        <InputField<AddressFormValues> id="zipCode" label="우편번호" control={control} />
        <InputField<AddressFormValues> id="addr" label="주소" control={control} />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            {...register('isDefault')}
            className="mr-2"
          />
          <label htmlFor="isDefault" className="text-sm">기본 배송지로 설정</label>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressEditModal;
