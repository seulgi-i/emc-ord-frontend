import { Address } from '@/lib/schemas/address.schemas';

export const mockAddresses: Address[] = [
  {
    id: '1',
    receiver: '김철수',
    addr: '서울특별시 강남구 테헤란로 123, 456호',
    zipCode: '06234',
    phone: '01012345678',
    isDefault: true,
  },
  {
    id: '2',
    receiver: '박영희',
    addr: '서울특별시 송파구 올림픽로 789, 101동 202호',
    zipCode: '05234',
    phone: '01087654321',
    isDefault: false,
  },
  {
    id: '3',
    receiver: '이민수',
    addr: '경기도 성남시 분당구 판교역로 111, 별관 3층',
    zipCode: '13456',
    phone: '01055556666',
    isDefault: false,
  },
  {
    id: '4',
    receiver: '최은정',
    addr: '부산광역시 해운대구 센텀중앙로 222, 타워 10층',
    zipCode: '48012',
    phone: '01033334444',
    isDefault: false,
  },
  {
    id: '5',
    receiver: '정호영',
    addr: '대구광역시 수성구 달구벌대로 333, 오피스텔 505호',
    zipCode: '42123',
    phone: '01077778888',
    isDefault: false,
  },
];

// 페이지네이션을 위한 함수
export const getAddressesByPage = (page: number = 1, pageSize: number = 5) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = mockAddresses.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: mockAddresses.length,
    page,
    pageSize,
  };
};

// 새 주소 추가 시뮬레이션
export const addMockAddress = (address: Omit<Address, 'id'>): Address => {
  const newAddress: Address = {
    ...address,
    id: String(mockAddresses.length + 1),
  };
  mockAddresses.push(newAddress);
  return newAddress;
};

// 주소 업데이트 시뮬레이션
export const updateMockAddress = (id: string, updatedData: Partial<Address>): Address | null => {
  const index = mockAddresses.findIndex(addr => addr.id === id);
  if (index === -1) return null;
  
  mockAddresses[index] = { ...mockAddresses[index], ...updatedData };
  return mockAddresses[index];
};

// 주소 삭제 시뮬레이션
export const deleteMockAddress = (id: string): boolean => {
  const index = mockAddresses.findIndex(addr => addr.id === id);
  if (index === -1) return false;
  
  mockAddresses.splice(index, 1);
  return true;
};
