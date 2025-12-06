'use client';

import { useRouter } from 'next/navigation';
import { updateInventoryItem, deleteInventoryItem } from '@/app/inventory/edit/[id]/actions';


type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string | null;
  deviceModel: string | null;
  quantity: number;
  reorderLevel: number;
  cost: number;
  sellPrice: number | null;
  location: string | null;
  binNumber: string | null;
};

interface EditInventoryFormProps {
  item: InventoryItem;
}

export default function EditInventoryForm({ item }: EditInventoryFormProps) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await updateInventoryItem(item.id, formData);
    router.push('/inventory');
  }

  async function handleDelete() {
    if (confirm('Are you sure you want to delete this inventory item?')) {
      await deleteInventoryItem(item.id);
      router.push('/inventory');
    }
  }

  return (
    <form action={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
          <input
            type="text"
            name="sku"
            defaultValue={item.sku}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Name *</label>
          <input
            type="text"
            name="name"
            defaultValue={item.name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          name="description"
          defaultValue={item.description || ''}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            type="text"
            name="category"
            defaultValue={item.category || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Device Model</label>
          <input
            type="text"
            name="deviceModel"
            defaultValue={item.deviceModel || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Current Quantity *</label>
          <input
            type="number"
            name="quantity"
            defaultValue={item.quantity}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reorder Level *</label>
          <input
            type="number"
            name="reorderLevel"
            defaultValue={item.reorderLevel}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Unit *</label>
          <input
            type="number"
            name="cost"
            defaultValue={item.cost}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sell Price</label>
          <input
            type="number"
            name="sellPrice"
            defaultValue={item.sellPrice || ''}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Storage Location</label>
          <input
            type="text"
            name="location"
            defaultValue={item.location || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bin Number</label>
          <input
            type="text"
            name="binNumber"
            defaultValue={item.binNumber || ''}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-4 pt-6">
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Update Inventory Item</button>
        <button type="button" onClick={handleDelete} className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">Delete Item</button>
      </div>
    </form>
  );
}