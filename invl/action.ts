"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";




export async function addPartAction(formData: FormData) {
  const name = formData.get("name") as string;
  const sku = formData.get("sku") as string;
  const cost = Number(formData.get("cost"));
  const sellPrice = formData.get("sellPrice") ? Number(formData.get("sellPrice")) : null;
  const quantity = Number(formData.get("quantity"));
  
  await prisma.inventoryItem.create({ 
    data: { 
      name,
      sku, 
      cost,
      sellPrice,
      quantity,
      isActive: true
    } 
  });
  revalidatePath("/invl");
}



// Create invoice (simplified - based on your actual schema)
export async function createInvoiceAction(formData: FormData) {
  const partId = formData.get("partId") as string;
  const quantity = Number(formData.get("quantity"));
  const customer = formData.get("customer") as string;

  const part = await prisma.inventoryItem.findUnique({ where: { id: partId } });
  if (!part || part.quantity < quantity) {
    throw new Error("Insufficient stock");
  }

  // Find or create customer account
  let account = await prisma.account.findFirst({
    where: { name: customer }
  });

  if (!account) {
    account = await prisma.account.create({
      data: { name: customer, balance: 0 }
    });
  }

  // Create a ticket for this part request
  const ticket = await prisma.ticket.create({
    data: {
      device: `Part Request: ${part.name}`,
      customerName: customer,
      accountId: account.id,
      status: 'CLOSED',
      description: `${quantity}x ${part.name}`
    }
  });

  const total = (part.sellPrice || part.cost) * quantity;

  // Create invoice
  await prisma.$transaction([
    prisma.invoice.create({
      data: {
        ticketId: ticket.id,
        accountId: account.id,
        total: total,
        paidAmount: 0,
        dueAmount: total,
      },
    }),
    prisma.inventoryItem.update({
      where: { id: partId },
      data: { quantity: { decrement: quantity } },
    }),
  ]);

  revalidatePath("/invl");
}

// Mark invoice as paid
export async function markInvoicePaidAction(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId }
  });
  
  if (invoice) {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { 
        paidAmount: invoice.total,
        dueAmount: 0 
      },
    });
  }
  revalidatePath("/invl");
}