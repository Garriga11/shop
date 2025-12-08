
import { addInvoice } from '@/app/invoice/actions';
import { redirect } from 'next/navigation';

export default function AddInvoicePage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    await addInvoice(formData);
    redirect('/invoice');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Invoice</h1>
      <form action={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ticket ID *</label>
            <input type="text" name="ticketId" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Account ID *</label>
            <input type="text" name="accountId" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Total *</label>
            <input type="number" name="total" step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paid Amount</label>
            <input type="number" name="paidAmount" step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Amount *</label>
            <input type="number" name="dueAmount" step="0.01" min="0" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>
        <div className="flex gap-4 pt-6">
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">Add Invoice</button>
          <a href="/invoice" className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 text-center">Cancel</a>
        </div>
      </form>
    </div>
  );
}
