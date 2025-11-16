// components/recentTickets.tsx
import Link from "next/link";

interface RecentTicket {
  id: string;
  device?: string | null;
  deviceSN?: string | null;
  status: string;
  createdAt: Date;
  customerName?: string | null;
  description?: string | null;
}

export default function RecentTickets({
  tickets = [],
}: {
  tickets?: RecentTicket[];
}) {
  return (
    <div className="overflow-auto bg-white rounded shadow">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800">Recent Tickets</h3>
      </div>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Device</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Created</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((t) => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div>
                    <div className="font-medium">{t.device || 'N/A'}</div>
                    {t.deviceSN && (
                      <div className="text-sm text-gray-500">SN: {t.deviceSN}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="text-sm">{t.customerName || 'N/A'}</div>
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      t.status === "OPEN" 
                        ? "bg-green-100 text-green-800" 
                        : t.status === "CLOSED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <Link
                    href={`/ticket/${t.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                <div className="flex flex-col items-center">
                  <div className="text-4xl mb-2">📝</div>
                  <div>No recent tickets found</div>
                  <Link 
                    href="/ticket/new" 
                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Create your first ticket →
                  </Link>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {tickets.length > 0 && (
        <div className="p-3 bg-gray-50 border-t">
          <Link 
            href="/ticket" 
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all tickets →
          </Link>
        </div>
      )}
    </div>
  );
}
