// app/api/tickets/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {

  const { device, deviceSN, location, accountId, description, customerName, customerPhone } = await request.json();

  const ticket = await prisma.ticket.create({
    data: {
      device,
      deviceSN,
      location,
      accountId,
      description,
      customerName,
      customerPhone,
      status: "OPEN",
    },
  });

  return NextResponse.json(ticket);
}
