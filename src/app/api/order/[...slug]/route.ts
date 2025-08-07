import { NextResponse } from 'next/server';
import { mockProducts, mockDiscount, mockPayment } from '@/features/order/mock/data';

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const [slug] = params.slug;

  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

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
    const [slug] = params.slug;

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
