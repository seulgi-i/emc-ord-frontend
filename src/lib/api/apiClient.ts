import { z } from 'zod';
import { useGlobalUIStore } from '@/lib/stores/globalUIStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// apiClient에 전달될 옵션의 타입을 확장합니다.
interface ApiClientOptions extends RequestInit {
  loadingMessage?: string;
}

async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
  schema?: z.ZodType<T>
): Promise<T> {
  const { loadingMessage, ...fetchOptions } = options;
  // Use the new store actions
  const { showLoader, hideLoader } = useGlobalUIStore.getState();

  // 로딩 메시지가 있으면 로딩 상태를 활성화합니다.
  if (loadingMessage) {
    showLoader(loadingMessage);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 추후 인증 토큰 등을 여기에 추가할 수 있습니다.
      // Authorization: `Bearer ${token}`,
    },
  };

  const mergedOptions: RequestInit = {
    ...defaultOptions,
    ...fetchOptions,
    headers: {
      ...defaultOptions.headers,
      ...fetchOptions.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      // 서버에서 보낸 에러 메시지를 포함하여 예외를 던집니다.
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // zod 스키마가 제공되면 데이터 유효성을 검사합니다.
    if (schema) {
      const validationResult = schema.safeParse(data);
      if (!validationResult.success) {
        // 유효성 검사 실패 시 에러를 던집니다.
        console.error('API response validation failed:', validationResult.error);
        throw new Error('API response validation failed');
      }
      return validationResult.data;
    }

    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // 네트워크 에러나 기타 예외를 처리합니다.
    throw error;
  } finally {
    // API 호출이 성공하든 실패하든 로딩 상태를 정리합니다.
    if (loadingMessage) {
      hideLoader();
    }
  }
}

export default apiClient;
