import { addRepairType } from './actions';
import prisma from '@/lib/prisma';
import { Card } from '@/app/components/Card';

export default async function AddRepairTypePage() {
  const repairTypes = await prisma.repairType.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Add Repair Type</h1>

      <Card className="p-6 mb-6">
        <form action={addRepairType} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Repair Name *</label>
              <input
                name="name"
                placeholder="e.g., Screen Replacement"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <input
                name="category"
                placeholder="e.g., Screen Repair, Port Replacement"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Device Type *</label>
              <input
                name="deviceType"
                placeholder="e.g., iPhone, Samsung, iPad"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Device Model *</label>
              <input
                name="deviceModel"
                placeholder="e.g., iPhone 14, Galaxy S21"
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Labor Price ($) *</label>
              <input
                name="laborPrice"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Detailed description of the repair"
              rows={3}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Add Repair Type
          </button>
        </form>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Existing Repair Types</h2>
      <div className="space-y-3">
        {repairTypes.map((rt) => (
          <Card key={rt.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{rt.name}</h3>
                <p className="text-sm text-gray-600">
                  {rt.deviceType} - {rt.deviceModel} | {rt.category}
                </p>
                {rt.description && (
                  <p className="text-sm text-gray-500 mt-1">{rt.description}</p>
                )}
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">${rt.laborPrice.toFixed(2)}</div>
                <div className="text-xs text-gray-500">Labor</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
