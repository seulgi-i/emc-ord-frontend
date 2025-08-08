import { NextResponse } from 'next/server';
import { mockProducts, mockDiscount, mockPayment } from '@/components/features/order/mock/data';


/*
API 요청의 전체 흐름 (연결성 및 데이터 흐름)
 
  `src/lib/apiClient.ts`,`src/features/order/api/orderApi.ts`, `src/app/api/order/[...slug]/route.ts`
  이 세 파일은 서로 긴밀하게 연결되어 있습니다. 데이터 요청은 다음과 같은 흐름으로 이루어집니다.

   1. 요청 시작 (프론트엔드 / 클라이언트 사이드)
       * 사용자가 웹 페이지에서 어떤 액션(예: 주문서 페이지 로드, 상품 선택)을 취하면,
         src/features/order/hooks/useOrderSheet.ts와 같은 프론트엔드 훅이 데이터를 필요로 합니다.
       * 이 훅은 src/features/order/api/orderApi.ts에 정의된 함수(예: fetchProducts(), fetchDiscount())를 호출합니다.

   2. API 호출 추상화 (프론트엔드 / 클라이언트 사이드)
       * fetchProducts() 함수는 내부적으로 src/lib/apiClient.ts의 get() 메서드를 호출합니다. 이때, 요청할 URL(예:
         /api/order/products)을 apiClient에 전달합니다.

   3. 실제 네트워크 요청 (프론트엔드 / 클라이언트 사이드)
       * src/lib/apiClient.ts는 전달받은 URL을 사용하여 브라우저(클라이언트) 에서 실제 HTTP GET 요청을 보냅니다. 이 요청은
         네트워크를 통해 서버로 전송됩니다.

   4. 서버 사이드 처리 (백엔드 / 서버 사이드)
       * 클라이언트에서 보낸 HTTP 요청은 Next.js 애플리케이션이 실행 중인 서버에 도달합니다.
       * 서버는 요청된 URL(예: /api/order/products)을 분석하여, 해당 요청을 처리할 src/app/api/order/[...slug]/route.ts
         파일을 찾아 실행합니다.
       * route.ts 파일 내부의 해당 HTTP 메서드 핸들러(예: GET 요청이면 GET 함수)가 실행됩니다. 이 서버 코드는
         데이터베이스에서 데이터를 조회하거나, 다른 외부 API를 호출하는 등의 비즈니스 로직을 수행합니다.

   5. 응답 전송 (백엔드 / 서버 사이드)
       * src/app/api/order/[...slug]/route.ts는 처리 결과를 HTTP 응답(예: JSON 데이터)으로 구성하여 클라이언트에게 다시
         보냅니다.

   6. 데이터 수신 및 반환 (프론트엔드 / 클라이언트 사이드)
       * src/lib/apiClient.ts가 서버로부터의 HTTP 응답을 수신합니다.
       * apiClient는 응답 데이터를 파싱하고, 필요한 경우 에러를 처리합니다.
       * 파싱된 데이터는 src/features/order/api/orderApi.ts의 fetchProducts() 함수로 반환됩니다.
       * 최종적으로 fetchProducts() 함수는 이 데이터를 src/features/order/hooks/useOrderSheet.ts 훅으로 반환하고, 훅은 이
         데이터를 컴포넌트에 제공하여 UI를 업데이트합니다.

   * `src/lib/apiClient.ts`: 전화기 (실제로 전화를 걸고 받는 장치)
   * `src/features/order/api/orderApi.ts`: 전화번호부 (어떤 번호로 전화해야 할지 알려주는 목록)
   * `src/app/api/order/[...slug]/route.ts`: 전화 받는 사람 (전화를 받고 요청을 처리하는 사람)
*/
export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const [slug] = await params.slug;

  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  console.log("slug", slug)
  switch (slug) {
    case 'products':
      return NextResponse.json(mockProducts);
    case 'discount': 
      return NextResponse.json(mockDiscount);
    case 'payment':
      return NextResponse.json(mockPayment);
    default:
      return new NextResponse('Not Found', { status: 404 });
  }
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
    const [slug] = await params.slug;

    if (slug !== 'submit') {
        return new NextResponse('Not Found', { status: 404 });
    }

    try {
        const orderData = await request.json();
        console.log("Received order data:", orderData);

        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        const orderId = `ORDER_${Date.now()}`;
        return NextResponse.json({ orderId });

    } catch (error) {
        return new NextResponse('Invalid request body', { status: 400 });
    }
}
