import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { closeTicketAndInvoice } from "@/app/ticket/closeTicket/action";

export default async function CloseTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const ticket = await prisma.ticket.findUnique({
    where: { id: resolvedParams.id },
    include: {
      account: true,
      repairType: {
        include: {
          parts: true
        }
      }
    }
  });

  if (!ticket) {
    notFound();
  }

  if (ticket.status === "CLOSED") {
    redirect(`/ticket/${ticket.id}`);
  }

  async function handleCloseTicket(formData: FormData) {
    "use server";
    
    const total = parseFloat(formData.get("total") as string);
    
    if (isNaN(total) || total < 0) {
      throw new Error("Invalid total amount");
    }

    try {
      const result = await closeTicketAndInvoice(resolvedParams.id, total);
      redirect(`/ticket/${resolvedParams.id}`);
    } catch (error) {
      console.error("Error closing ticket:", error);
      throw error;
    }
  }

  // Calculate suggested total based on repair type
  const suggestedTotal = ticket.repairType 
    ? ticket.repairType.laborPrice + (ticket.repairType.parts.reduce((sum, part) => sum + part.cost, 0))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Close Ticket #{ticket.id.slice(-8)}
          </h1>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Ticket Summary</h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p><strong>Customer:</strong> {ticket.customerName || ticket.account?.name}</p>
              <p><strong>Device:</strong> {ticket.device} ({ticket.deviceSN})</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              {ticket.repairType && (
                <>
                  <p><strong>Repair Type:</strong> {ticket.repairType.name}</p>
                  <p><strong>Labor Cost:</strong> ${ticket.repairType.laborPrice.toFixed(2)}</p>
                  {ticket.repairType.parts.length > 0 && (
                    <div>
                      <p><strong>Required Parts:</strong></p>
                      <ul className="ml-4 text-sm">
                        {ticket.repairType.parts.map(part => (
                          <li key={part.id}>
                            • {part.name} - ${part.cost.toFixed(2)}
                            {part.quantity < 1 && (
                              <span className="text-red-600 ml-2">(Out of stock!)</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <form action={handleCloseTicket} className="space-y-4">
            <div>
              <label htmlFor="total" className="block text-sm font-medium text-gray-700 mb-2">
                Total Invoice Amount
              </label>
              <input
                type="number"
                id="total"
                name="total"
                step="0.01"
                min="0"
                defaultValue={suggestedTotal.toFixed(2)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {suggestedTotal > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Suggested total based on repair type: ${suggestedTotal.toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Close Ticket & Create Invoice
              </button>
              <a
                href={`/ticket/${ticket.id}`}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
              >
                Cancel
              </a>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">What happens when you close this ticket?</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Ticket status will change to CLOSED</li>
              <li>• An invoice will be created for the specified amount</li>
              <li>• Required parts will be deducted from inventory</li>
              <li>• Revenue record will be created</li>
              <li>• Any due amount will be added to the customer account balance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}