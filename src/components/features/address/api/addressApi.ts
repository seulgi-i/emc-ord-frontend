import { Address, AddressFormValues, AddressPagination } from '@/lib/schemas/address.schemas';
import { 
  getAddressesByPage, 
  addMockAddress, 
  updateMockAddress, 
  deleteMockAddress 
} from '../mock/data';

// 배송지 목록 조회
export const fetchAddresses = async (page: number = 1, pageSize: number = 5): Promise<AddressPagination> => {
  // 실제 API 호출 시뮬레이션 (지연 추가)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return getAddressesByPage(page, pageSize);
};

// 새 배송지 추가
export const addAddress = async (addressData: AddressFormValues): Promise<Address> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newAddress = addMockAddress(addressData);
  return newAddress;
};

// 배송지 수정
export const updateAddress = async (id: string, addressData: AddressFormValues): Promise<Address> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const updatedAddress = updateMockAddress(id, addressData);
  if (!updatedAddress) {
    throw new Error('주소를 찾을 수 없습니다.');
  }
  
  return updatedAddress;
};

// 배송지 삭제
export const deleteAddress = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const success = deleteMockAddress(id);
  if (!success) {
    throw new Error('주소를 찾을 수 없습니다.');
  }
};
