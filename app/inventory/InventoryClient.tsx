"use client";

import { useState } from "react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  deviceModel?: string;
  quantity: number;
  reorderLevel: number;
  cost: number;
  sellPrice?: number;
  needsReorder: boolean;
  isActive: boolean;
  location?: string;
  binNumber?: string;
}

interface InventoryClientProps {
  inventory: InventoryItem[];
}

export default function InventoryClient({ inventory }: InventoryClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.deviceModel && item.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()));
    
    switch (filter) {
      case 'low-stock':
        return matchesSearch && item.quantity <= item.reorderLevel;
      case 'out-of-stock':
        return matchesSearch && item.quantity === 0;
      case 'needs-reorder':
        return matchesSearch && item.needsReorder;
      default:
        return matchesSearch && item.isActive;
    }
  });

  const lowStockCount = inventory.filter(item => item.quantity <= item.reorderLevel && item.isActive).length;
  const outOfStockCount = inventory.filter(item => item.quantity === 0 && item.isActive).length;
  const needsReorderCount = inventory.filter(item => item.needsReorder && item.isActive).length;

  return (
    <div className="space-y-6">
      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('low-stock')}
            className={`px-3 py-1 rounded text-sm ${filter === 'low-stock' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilter('out-of-stock')}
            className={`px-3 py-1 rounded text-sm ${filter === 'out-of-stock' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            Out of Stock ({outOfStockCount})
          </button>
          <button
            onClick={() => setFilter('needs-reorder')}
            className={`px-3 py-1 rounded text-sm ${filter === 'needs-reorder' ? 'bg-yellow-600 text-white' : 'bg-gray-200'}`}
          >
            Needs Reorder ({needsReorderCount})
          </button>
        </div>
        
        <input
          type="text"
          placeholder="Search by name, SKU, or device model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-lg flex-1 min-w-64"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800">Total Items</h3>
          <p className="text-2xl font-bold text-blue-600">{inventory.filter(i => i.isActive).length}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800">Low Stock</h3>
          <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="font-semibold text-red-800">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold text-yellow-800">Needs Reorder</h3>
          <p className="text-2xl font-bold text-yellow-600">{needsReorderCount}</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device Model</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.sku}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      {item.description && (
                        <div className="text-sm text-gray-500">{item.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.deviceModel || '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{item.category || '-'}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{item.quantity}</div>
                      <div className="text-xs text-gray-500">Reorder: {item.reorderLevel}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">${item.cost.toFixed(2)}</div>
                      {item.sellPrice && (
                        <div className="text-xs text-gray-500">Sell: ${item.sellPrice.toFixed(2)}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          item.quantity === 0
                            ? 'bg-red-100 text-red-800'
                            : item.quantity <= item.reorderLevel
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.quantity === 0 ? 'Out of Stock' : item.quantity <= item.reorderLevel ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium space-x-2">
                      <Link
                        href={`/inventory/edit/${item.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/inventory/history/${item.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        History
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}