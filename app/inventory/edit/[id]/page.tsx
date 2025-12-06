// app/inventory/edit/[id]/page.tsx
import prisma from '@/lib/prisma';
import EditInventoryForm from '@/app/inventory/edit/[id]/EditInventory';
import { notFound } from 'next/navigation';

export default async function EditInventoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const item = await prisma.inventoryItem.findUnique({
    where: { id }
  });

  if (!item) {
    notFound();
  }

  return <EditInventoryForm item={item} />;
}