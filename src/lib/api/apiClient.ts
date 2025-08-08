import { z } from 'zod';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodType<T>
): Promise<T> {
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
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  console.log("apiclient ==> url", url);
  console.log("apiclient ==> mergedOptions", mergedOptions);

  try {
    const response = await fetch(url, mergedOptions);
    console.log("apiclient ==> response", response)

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
    console.log("data", data);

    return data;
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    // 네트워크 에러나 기타 예외를 처리합니다.
    throw error;
  }
}

export default apiClient;
