'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addRepairType(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || undefined,
    deviceType: (formData.get('deviceType') as string) || 'Universal',
    deviceModel: (formData.get('deviceModel') as string) || 'All Models',
    category: formData.get('category') as string,
    laborPrice: parseFloat(formData.get('laborPrice') as string),
  };

  await prisma.repairType.create({ data });
  revalidatePath('/repair-types/add');
  revalidatePath('/inventory/mapping');
  revalidatePath('/ticket/new');
}
