
import { addPartAction, createInvoiceAction, markInvoicePaidAction, } from "./action";
import prisma from "@/lib/prisma";

export default async function InventoryPage() {
  const parts = await prisma.inventoryItem.findMany({
    where: { isActive: true }
  });
  const invoices = await prisma.invoice.findMany({
    include: { 
      ticket: true,
      account: true 
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 rounded shadow-4">
      <h1 className="text-xl font-bold">Inventory Management</h1>

      {/* Add Inventory Form */}
      <form action={addPartAction} className="flex gap-2 mt-4 mb-6 items-end">
        <input name="name" placeholder="Name" required className="border px-2 py-1 rounded" />
        <input name="sku" placeholder="SKU" required className="border px-2 py-1 rounded w-24" />
        <input name="cost" type="number" step="0.01" placeholder="Cost" required className="border px-2 py-1 rounded w-24" />
        <input name="sellPrice" type="number" step="0.01" placeholder="Sell Price" className="border px-2 py-1 rounded w-24" />
        <input name="quantity" type="number" min="0" placeholder="Quantity" required className="border px-2 py-1 rounded w-20" />
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Add Item</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full border border-gray-300 rounded-lg shadow-sm mt-2 bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 border-b font-semibold text-left">SKU</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Name</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Quantity</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Cost</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Sell Price</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p: any, idx: number) => (
              <tr key={p.id} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                <td className="px-4 py-2 border-b">{p.sku}</td>
                <td className="px-4 py-2 border-b">{p.name}</td>
                <td className="px-4 py-2 border-b">{p.quantity}</td>
                <td className="px-4 py-2 border-b">${p.cost.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">{p.sellPrice ? `$${p.sellPrice.toFixed(2)}` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg mt-6">Request Item</h2>
      <form action={createInvoiceAction} className="flex gap-2 mt-2">
        <input name="customer" placeholder="Customer" required className="border px-2" />
        <select name="partId" required>
          <option value="">Select Item</option>
          {parts.map((p: any) => (
            <option key={p.id} value={p.id}>
              {p.sku} - {p.name} (Qty: {p.quantity})
            </option>
          ))}
        </select>
        <input type="number" name="quantity" min="1" defaultValue="1" required className="w-16 border px-1" />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Create Invoice</button>
      </form>

      <h2 className="text-lg mt-6">Invoices</h2>
      <ul>
        {invoices.map((inv: any) => (
          <li key={inv.id} className="border p-2 mt-2">
            <div>
              <strong>Ticket:</strong> {inv.ticket?.device || 'N/A'} 
              {inv.ticket?.deviceSN && ` (${inv.ticket.deviceSN})`}
            </div>
            <div>
              <strong>Customer:</strong> {inv.ticket?.customerName || inv.account?.name || 'N/A'}
            </div>
            <div><strong>Total:</strong> ${inv.total.toFixed(2)}</div>
            <div><strong>Paid:</strong> ${inv.paidAmount.toFixed(2)}</div>
            <div><strong>Due:</strong> ${inv.dueAmount.toFixed(2)}</div>
            <div><strong>Status:</strong> {inv.dueAmount <= 0 ? "Paid" : "Unpaid"}</div>
            {inv.dueAmount > 0 && (
              <form
                action={async () => {
                  "use server";
                  await markInvoicePaidAction(inv.id);
                }}
              >
                <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded mt-2">Mark Paid</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}