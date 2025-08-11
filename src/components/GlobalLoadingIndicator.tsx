'use client';

import { useGlobalUIStore } from "@/lib/stores/globalUIStore";
import React from 'react';

const GlobalLoadingIndicator: React.FC = () => {
  const { isGlobalLoading, loadingMessage } = useGlobalUIStore();
  
  if (!isGlobalLoading) return null;

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
      fontSize: '2rem',
      zIndex: 9999,
    }}>
      <span>{loadingMessage || '로딩 중...'}</span>
    </div>
  );
};

export default GlobalLoadingIndicator;
