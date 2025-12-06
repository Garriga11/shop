'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addInventoryItem } from '../actions';

const deviceCategories = [
  'Screens',
  'Charging Ports',
  'Batteries',
  'Cameras',
  'Speakers',
  'Microphones',
  'Tools',
  'Adhesives',
  'Screws',
  'Other'
];

const deviceModels = [
  'iPhone 13',
  'iPhone 14',
  'iPhone 15',
  'Samsung Galaxy S21',
  'Samsung Galaxy S22',
  'Samsung Galaxy S23',
  'iPad Air',
  'iPad Pro',
  'Google Pixel 7',
  'Google Pixel 8',
  'Universal',
  'Other'
];

// Category abbreviations for SKU
const categoryAbbr: Record<string, string> = {
  'Screens': 'SCR',
  'Charging Ports': 'CHG',
  'Batteries': 'BAT',
  'Cameras': 'CAM',
  'Speakers': 'SPK',
  'Microphones': 'MIC',
  'Tools': 'TLS',
  'Adhesives': 'ADH',
  'Screws': 'SCW',
  'Other': 'OTH'
};

// Device model abbreviations
const modelAbbr: Record<string, string> = {
  'iPhone 13': 'IP13',
  'iPhone 14': 'IP14',
  'iPhone 15': 'IP15',
  'Samsung Galaxy S21': 'SG21',
  'Samsung Galaxy S22': 'SG22',
  'Samsung Galaxy S23': 'SG23',
  'iPad Air': 'IPA',
  'iPad Pro': 'IPP',
  'Google Pixel 7': 'GP7',
  'Google Pixel 8': 'GP8',
  'Universal': 'UNV',
  'Other': 'OTH'
};

export default function AddInventoryPage() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [sku, setSku] = useState('');
  const [loading, setLoading] = useState(false);

  const generateSKU = () => {
    if (!deviceModel || !category) {
      alert('Please select both device model and category first');
      return;
    }
    
    const modelCode = modelAbbr[deviceModel] || 'XXX';
    const catCode = categoryAbbr[category] || 'XXX';
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const generatedSku = `${modelCode}-${catCode}-${randomNum}`;
    setSku(generatedSku);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      await addInventoryItem(formData);
      router.push('/inventory');
    } catch (error) {
      console.error('Error adding inventory:', error);
      alert('Failed to add inventory item');
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <a href="/inventory" className="mr-4 text-blue-600 hover:text-blue-800">← Back</a>
        <h1 className="text-3xl font-bold">Add New Inventory Item</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="sku"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="e.g., IP14-CHG-1234"
              />
              <button
                type="button"
                onClick={generateSKU}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 whitespace-nowrap"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select device model and category first, then click Generate
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., iPhone 13 OLED Screen Assembly"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Optional detailed description of the item"
          />
        </div>

        {/* Category and Device */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              {deviceCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Device Model
            </label>
            <select
              name="deviceModel"
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Device Model</option>
              {deviceModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock and Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reorder Level *
            </label>
            <input
              type="number"
              name="reorderLevel"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost per Unit *
            </label>
            <input
              type="number"
              name="cost"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sell Price
            </label>
            <input
              type="number"
              name="sellPrice"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Location
            </label>
            <input
              type="text"
              name="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Shelf A1, Storage Room B"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bin Number
            </label>
            <input
              type="text"
              name="binNumber"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., A1-001, B2-003"
            />
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Inventory Item'}
          </button>
          <a
            href="/inventory"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
