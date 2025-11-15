"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";




export async function addPartAction(formData: FormData) {
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  await prisma.part.create({ data: { name, price, stock } });
  revalidatePath("/invl");
}



// Create invoice and deduct inventory
export async function createInvoiceAction(formData: FormData) {
  const partId = formData.get("partId") as string;
  const quantity = Number(formData.get("quantity"));
  const customer = formData.get("customer") as string;

  const part = await prisma.part.findUnique({ where: { id: partId } });
  if (!part || part.stock < quantity) throw new Error("Insufficient stock");

  // Create invoice and deduct inventory in a transaction
  await prisma.$transaction([
    prisma.invoice.create({
      data: {
        customer,
        total: part.price * quantity,
        items: {
          create: [{ partId, quantity, price: part.price }],
        },
      },
    }),
    prisma.ticket.update({
      where: { id: partId },
      data: { stock: { decrement: quantity } },
    }),
  ]);

  revalidatePath("/parts");
}

// Mark invoice as paid
export async function markInvoicePaidAction(invoiceId: string) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { paid: true },
  });
  revalidatePath("/parts");
}