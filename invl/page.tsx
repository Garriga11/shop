
import { addPartAction, createInvoiceAction, markInvoicePaidAction } from "./action";

export default async function PartsPage() {
  const parts = await prisma.part.findMany();
  const invoices = await prisma.invoice.findMany({
    include: { items: { include: { part: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 rounded shadow-4">
      <h1 className="text-xl font-bold">Parts</h1>

      {/* Add Inventory Form */}
      <form action={addPartAction} className="flex gap-2 mt-4 mb-6 items-end">
        <input name="name" placeholder="Name" required className="border px-2 py-1 rounded" />
        <input name="price" type="number" step="0.01" placeholder="Price" required className="border px-2 py-1 rounded w-24" />
        <input name="stock" type="number" min="0" placeholder="Stock" required className="border px-2 py-1 rounded w-20" />
        <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Add Part</button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-[400px] w-full border border-gray-300 rounded-lg shadow-sm mt-2 bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="px-4 py-2 border-b font-semibold text-left">Name</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Stock</th>
              <th className="px-4 py-2 border-b font-semibold text-left">Price</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((p, idx) => (
              <tr key={p.id} className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                <td className="px-4 py-2 border-b">{p.name}</td>
                <td className="px-4 py-2 border-b">{p.stock}</td>
                <td className="px-4 py-2 border-b">${p.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg mt-6">Request Part</h2>
      <form action={createInvoiceAction} className="flex gap-2 mt-2">
        <input name="customer" placeholder="Customer" required className="border px-2" />
        <select name="partId" required>
          {parts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input type="number" name="quantity" min="1" defaultValue="1" required className="w-16 border px-1" />
        <button type="submit" className="bg-blue-500 text-white px-2 py-1 rounded">Create Invoice</button>
      </form>

      <h2 className="text-lg mt-6">Invoices</h2>
      <ul>
        {invoices.map((inv) => (
          <li key={inv.id} className="border p-2 mt-2">
            <div>
              {inv.items.map((item) => (
                <div key={item.id}>
                  {item.quantity} × {item.part.name} = ${(item.price * item.quantity).toFixed(2)}
                </div>
              ))}
            </div>
            <div>Total: ${inv.total.toFixed(2)}</div>
            <div>Status: {inv.paid ? "Paid" : "Unpaid"}</div>
            {!inv.paid && (
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