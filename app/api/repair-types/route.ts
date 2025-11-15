import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {

    const repairTypes = await prisma.repairType.findMany({
      where: { isActive: true },
      include: {
        parts: {
          select: {
            id: true,
            name: true,
            sku: true,
            quantity: true,
            cost: true
          }
        }
      },
      orderBy: [
        { deviceType: 'asc' },
        { deviceModel: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(repairTypes);
  } catch (error) {
    console.error('Error fetching repair types:', error);
    return NextResponse.json({ error: 'Failed to fetch repair types' }, { status: 500 });
  }
}
