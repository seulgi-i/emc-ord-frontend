'use client';

import { useGlobalUIStore } from "@/lib/stores/globalUIStore";
import React from 'react';

const GlobalLoadingIndicator: React.FC = () => {
  // 스토어에서 새로운 상태(loadingCount, message)를 가져옵니다.
  const { loadingCount, message } = useGlobalUIStore();
  
  // loadingCount가 0이면 아무것도 렌더링하지 않습니다.
  if (loadingCount === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '1.5rem',
      zIndex: 9999,
      flexDirection: 'column',
      gap: '20px',
    }}>
      {/* CSS 스피너 추가 */}
      <div style={{
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
      }}></div>
      <span>{message || '로딩 중...'}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GlobalLoadingIndicator;