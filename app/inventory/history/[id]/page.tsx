
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/Card';
import { Button } from '@/app/components/Button';

function getMovementTypeDisplay(type: string) {
  switch (type) {
    case 'STOCK_IN':
      return { text: 'Stock In', color: 'text-green-600 bg-green-100' };
    case 'STOCK_OUT':
      return { text: 'Stock Out', color: 'text-red-600 bg-red-100' };
    case 'ADJUSTMENT':
      return { text: 'Adjustment', color: 'text-blue-600 bg-blue-100' };
    case 'DAMAGED':
      return { text: 'Damaged', color: 'text-yellow-600 bg-yellow-100' };
    case 'RETURNED':
      return { text: 'Returned', color: 'text-purple-600 bg-purple-100' };
    default:
      return { text: type, color: 'text-gray-600 bg-gray-100' };
  }
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleString();
}

export default async function InventoryHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const item = await prisma.inventoryItem.findUnique({
    where: { id },
  });

  if (!item) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center text-red-600">Inventory item not found</div>
      </div>
    );
  }

  const movements = await prisma.stockMovement.findMany({
    where: { inventoryId: id },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/inventory" className="mr-4 text-blue-600 hover:text-blue-800">← Back</Link>
        <div>
          <h1 className="text-3xl font-bold">Inventory History</h1>
          <p className="text-gray-600 mt-1">
            {item.name} ({item.sku}) - Current Stock: {item.quantity}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No stock movements found for this item.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {movements.map((movement) => {
                    const typeDisplay = getMovementTypeDisplay(movement.type);
                    return (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(movement.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${typeDisplay.color}`}>
                            {typeDisplay.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {movement.type === 'STOCK_OUT' ? '-' : '+'}{Math.abs(movement.quantity)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{movement.reason}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movement.user?.name || movement.user?.email || 'Unknown'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between">
        <Link href="/inventory">
          <Button variant="secondary">Back to Inventory</Button>
        </Link>
        <Link href={`/inventory/edit/${id}`}>
          <Button variant="default">Edit Item</Button>
        </Link>
      </div>
    </div>
  );
}
