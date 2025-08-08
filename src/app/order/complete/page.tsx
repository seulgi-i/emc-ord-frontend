import React from 'react';

const OrderCompletePage = () => {
  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">주문이 성공적으로 완료되었습니다!</h1>
      <p className="text-lg mb-2">주문해주셔서 감사합니다.</p>
      <p className="text-md text-gray-600">주문 상세 내역은 마이페이지에서 확인하실 수 있습니다.</p>
      <div className="mt-8">
        <a href="/" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
          메인 페이지로 돌아가기
        </a>
      </div>
    </div>
  );
};

export default OrderCompletePage;
