import { Suspense } from "react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  // Get total count for pagination
  const totalTickets = await prisma.ticket.count();
  const totalPages = Math.ceil(totalTickets / pageSize);

  // Fetch tickets with pagination
  const tickets = await prisma.ticket.findMany({
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
    orderBy: { createdAt: 'desc' },
    skip,
    take: pageSize
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              All Tickets
            </h1>
            <p className="text-gray-600 mt-1">
              Showing {skip + 1}-{Math.min(skip + pageSize, totalTickets)} of {totalTickets} tickets
            </p>
          </div>
          <Link 
            href="/ticket/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + New Ticket
          </Link>
        </div>

        {/* Tickets Grid */}
        {tickets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {ticket.device || 'Unknown Device'}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "OPEN"
                        ? "bg-green-100 text-green-800"
                        : ticket.status === "CLOSED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p><strong>Customer:</strong> {ticket.customerName || ticket.account?.name || 'Unknown'}</p>
                  <p><strong>S/N:</strong> {ticket.deviceSN || 'No S/N'}</p>
                  <p><strong>Location:</strong> {ticket.location || 'No location'}</p>
                  {ticket.description && (
                    <p><strong>Description:</strong> {ticket.description}</p>
                  )}
                  <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                  {ticket.repairType && (
                    <p><strong>Repair Type:</strong> {ticket.repairType.name}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/ticket/${ticket.id}`}
                    className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-center hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    View Details
                  </Link>
                  {ticket.status === "OPEN" && (
                    <Link
                      href={`/ticket/closeTicket/${ticket.id}`}
                      className="flex-1 bg-green-50 text-green-700 px-4 py-2 rounded-md text-center hover:bg-green-100 transition-colors text-sm font-medium"
                    >
                      Close Ticket
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h2>
            <p className="text-gray-600 mb-6">Get started by creating your first ticket</p>
            <Link 
              href="/ticket/new"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create First Ticket
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              {/* Previous Button */}
              {page > 1 && (
                <Link
                  href={`/ticket?page=${page - 1}`}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = Math.max(1, Math.min(page - 2 + i, totalPages - 4 + i));
                if (pageNumber > totalPages) return null;
                
                return (
                  <Link
                    key={pageNumber}
                    href={`/ticket?page=${pageNumber}`}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      pageNumber === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              })}

              {/* Next Button */}
              {page < totalPages && (
                <Link
                  href={`/ticket?page=${page + 1}`}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Ticket Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTickets}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tickets.filter(t => t.status === 'OPEN').length}
              </div>
              <div className="text-sm text-gray-600">Open (This Page)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {tickets.filter(t => t.status === 'CLOSED').length}
              </div>
              <div className="text-sm text-gray-600">Closed (This Page)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalPages}</div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}