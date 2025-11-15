import { PrismaClient } from '@prisma/client';
import InventoryClient from './InventoryClient';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function InventoryPage() {
  const inventoryData = await prisma.inventoryItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Convert null values to undefined to match InventoryItem interface
  const inventory = inventoryData.map(item => ({
    ...item,
    description: item.description ?? undefined,
    category: item.category ?? undefined,
    deviceModel: item.deviceModel ?? undefined,
    binNumber: item.binNumber ?? undefined,
    location: item.location ?? undefined,
    sellPrice: item.sellPrice ?? undefined,
    buyPrice: item.sellPrice ?? undefined,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          <Link 
            href="/inventory/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add New Item
          </Link>
          <Link 
            href="/inventory/stock-movement"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Adjust Stock
          </Link>
          <Link 
            href="/inventory/mapping"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Part Mapping
          </Link>
        </div>
      </div>

      {inventory.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">No Inventory Items</h2>
          <p className="text-gray-600 mb-6">Get started by adding your first inventory item.</p>
          <Link 
            href="/inventory/add"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add First Item
          </Link>
        </div>
      ) : (
        <InventoryClient inventory={inventory}/>
      )}
    </div>
  );
}