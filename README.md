# ✨ 주요 기술 스택 (Tech Stack)

이 프로젝트는 다음과 같은 주요 라이브러리 및 프레임워크를 사용하여 구축되었습니다.

## 프레임워크 및 라이브러리

- **[Next.js](https://nextjs.org/)**: React 기반의 풀스택 웹 애플리케이션 프레임워크입니다. (App Router 사용)
- **[React](https://react.dev/)**: 사용자 인터페이스 구축을 위한 JavaScript 라이브러리입니다.
- **[@tanstack/react-query](https://tanstack.com/query/latest)**: 서버 상태 관리, 데이터 페칭, 캐싱, 동기화를 위한 라이브러리입니다.
- **[React Hook Form](https://react-hook-form.com/)**: 성능 좋고 유연한 폼 상태 관리 및 유효성 검사 라이브러리입니다.
- **[Zod](https://zod.dev/)**: TypeScript 우선의 스키마 선언 및 유효성 검사 라이브러리입니다. `react-hook-form`과 함께 사용됩니다.
- **[Zustand](https://zustand-demo.pmnd.rs/)**: 가볍고 빠른 클라이언트 상태 관리 라이브러리입니다.
- **[Tailwind CSS](https://tailwindcss.com/)**: 유틸리티 우선의 CSS 프레임워크로, 빠르고 효율적인 UI 개발을 지원합니다.

### 언어 및 개발 도구

- **[TypeScript](https://www.typescriptlang.org/)**: JavaScript에 정적 타입을 추가한 언어로, 코드 안정성과 가독성을 높입니다.
- **[ESLint](https://eslint.org/)**: 코드의 잠재적인 오류나 버그를 식별하고 일관된 코드 스타일을 유지하기 위한 린팅 도구입니다.

---

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js 14 App Router
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── api/                # Next.js API Routes (서버 사이드 API 엔드포인트)
│   │   └── order/
│   │       └── [...slug]/
│   │           └── route.ts # 주문 관련 API 엔드포인트
│   └── order/              # 주문 관련 페이지 라우트
│       ├── page.tsx        # 주문 메인 페이지 (예: 주문서 작성)
│       └── complete/
│           └── page.tsx    # 주문 완료 페이지
├── components/             # 재사용 가능한 UI 컴포넌트
│   ├── GlobalLoadingIndicator.tsx # 전역 로딩 인디케이터
│   ├── QueryProvider.tsx   # React Query Provider
│   ├── ui/                 # 기본 UI 컴포넌트 (shadcn/ui 스타일 및 공통 InputField 등)
│   │   └── InputField.tsx  # 공통 입력 필드 컴포넌트
│   └── features/           # 기능별 컴포넌트
│       ├── coupon/         # 쿠폰/할인 관련 컴포넌트
│       │   └── api/
│       │       └── discount.ts # 쿠폰/할인 API
│       ├── order/          # 주문 관련 컴포넌트
│       │   ├── order.types.ts # 주문 관련 타입 정의
│       │   ├── api/
│       │   │   └── orderApi.ts # 주문 API
│       │   ├── components/
│       │   │   ├── DiscountInfo.tsx # 할인 정보 컴포넌트
│       │   │   ├── PaymentInfo.tsx # 결제 정보 컴포넌트
│       │   │   ├── ProductInfo.tsx # 상품 정보 컴포넌트
│       │   │   └── OrderForm.tsx # 주문서 폼 컴포넌트
│       │   ├── hooks/      # 주문 관련 커스텀 훅 (예: useOrderForm)
│       │   ├── mock/
│       │   │   └── data.ts # 목(Mock) 데이터
│       │   └── store/      # 주문 관련 Zustand 스토어 (예: useOrderStore)
│       ├── payment/        # 결제 관련 컴포넌트
│       │   └── api/
│       │       └── paymentApi.ts # 결제 API
│       └── product/        # 상품 관련 컴포넌트
│           └── api/
│               └── productApi.ts # 상품 API
├── lib/                    # 유틸리티 및 라이브러리 코드
│   ├── api/                # API 클라이언트 (백엔드 API 호출 함수)
│   │   └── apiClient.ts
│   ├── stores/             # Zustand 스토어들 (전역 상태 관리)
│   │   └── globalUIStore.ts
│   ├── schemas/            # Zod 스키마들 (유효성 검사 스키마)
│   │   └── order.schemas.ts # 주문 관련 Zod 스키마
│   └── utils/              # 공통 유틸리티 함수들
└── hooks/                  # 공통 커스텀 훅들
    └── useOrderData.ts     # 주문 데이터 관련 훅
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.