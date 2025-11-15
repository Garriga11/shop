
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import DeleteTicketButton from "./DeleteTicketButton";
export const dynamic = "force-dynamic";

export default async function Ticket({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; 

  const ticket = await prisma.ticket.findUnique({
    where: { id: resolvedParams.id },
    include: { 
      User: true,
      account: true,
      repairType: true,
      invoice: true,
      ticketParts: {
        include: {
          inventoryItem: true
        }
      }
    }
  });

  if (!ticket) {
    notFound();
  }

  async function deleteticket() {
    "use server";

    await prisma.ticket.delete({
      where: { id: resolvedParams.id },
    });

    redirect("/ticket");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket #{ticket.id.slice(-8)}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {ticket.device} - {ticket.deviceSN}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  ticket.status === "OPEN"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {ticket.status}
              </span>
              {ticket.status === "OPEN" && (
                <Link
                  href={`/ticket/closeTicket/${ticket.id}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Close Ticket
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Ticket Details</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Customer:</span>
                <p className="text-gray-900">{ticket.customerName || ticket.account?.name || 'Unknown'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-900">{ticket.customerPhone || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Device:</span>
                <p className="text-gray-900">{ticket.device || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Serial Number:</span>
                <p className="text-gray-900">{ticket.deviceSN || 'Not provided'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-900">{ticket.location || 'Not specified'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Description:</span>
                <p className="text-gray-900">{ticket.description || 'No description provided'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Created:</span>
                <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()} at {new Date(ticket.createdAt).toLocaleTimeString()}</p>
              </div>
              {ticket.repairType && (
                <div>
                  <span className="font-medium text-gray-700">Repair Type:</span>
                  <p className="text-gray-900">{ticket.repairType.name}</p>
                  <p className="text-sm text-gray-600">{ticket.repairType.description}</p>
                  <p className="text-sm text-gray-600">Labor: ${ticket.repairType.laborPrice}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account & Billing */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account & Billing</h2>
            <div className="space-y-3">
              {ticket.account && (
                <>
                  <div>
                    <span className="font-medium text-gray-700">Account:</span>
                    <p className="text-gray-900">{ticket.account.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Account Balance:</span>
                    <p className={`font-semibold ${ticket.account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${ticket.account.balance.toFixed(2)}
                    </p>
                  </div>
                </>
              )}
              {ticket.invoice && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <h3 className="font-medium text-gray-700 mb-2">Invoice Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-semibold">${ticket.invoice.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid:</span>
                        <span className="text-green-600">${ticket.invoice.paidAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Due:</span>
                        <span className="text-red-600">${ticket.invoice.dueAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Parts Used */}
          {ticket.ticketParts && ticket.ticketParts.length > 0 && (
            <div className="bg-white rounded-lg shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Parts Used</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Part Name</th>
                      <th className="text-left py-2">SKU</th>
                      <th className="text-right py-2">Quantity</th>
                      <th className="text-right py-2">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticket.ticketParts.map((part) => (
                      <tr key={part.id} className="border-b">
                        <td className="py-2">{part.inventoryItem.name}</td>
                        <td className="py-2">{part.inventoryItem.sku}</td>
                        <td className="py-2 text-right">{part.quantityUsed}</td>
                        <td className="py-2 text-right">${part.costAtTime.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-between">
          <Link
            href="/ticket"
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Tickets
          </Link>
          
          <form action={deleteticket}>
            <DeleteTicketButton onDelete={deleteticket} />
          </form>
        </div>
      </div>
    </div>
  );
}