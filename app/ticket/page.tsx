import { Suspense } from "react";
import { PrismaClient } from "@prisma/client";
import RecentTickets from "@/components/recentTickets";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function TicketsPage() {
  // Fetch all tickets from the database
  const ticketsRaw = await prisma.ticket.findMany({
    include: {
      account: true,
      repairType: true,
      User: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Format tickets for the RecentTickets component
  const tickets = ticketsRaw.map(ticket => ({
    id: ticket.id,
    location: ticket.location || 'No location',
    status: ticket.status,
    createdAt: ticket.createdAt,
    serialNumber: ticket.deviceSN || 'No S/N',
    deviceSN: ticket.deviceSN || 'No S/N',
    device: ticket.device || 'Unknown device',
    description: ticket.description || 'No description',
    customerName: ticket.customerName || ticket.account?.name || 'Unknown customer'
  }));

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-blue-600">
            All Tickets ({tickets.length})
          </h1>
          <Link 
            href="/ticket/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Ticket
          </Link>
        </div>
        
        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-xl">No tickets found</p>
            <Link 
              href="/ticket/new"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Ticket
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {ticket.device}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "OPEN"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Customer:</strong> {ticket.customerName}</p>
                  <p><strong>S/N:</strong> {ticket.serialNumber}</p>
                  <p><strong>Location:</strong> {ticket.location}</p>
                  <p><strong>Description:</strong> {ticket.description}</p>
                  <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/ticket/${ticket.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    View Details
                  </Link>
                  {ticket.status === "OPEN" && (
                    <Link
                      href={`/ticket/closeTicket/${ticket.id}`}
                      className="flex-1 bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors"
                    >
                      Close Ticket
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
