
import prisma from "@/lib/prisma";
import { TicketIcon, UserIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/16/solid";
import MetricCard from "@/components/metricCard";
import RecentTickets from "@/components/recentTickets";
import Link from "next/link";
import { getTotalRevenue } from "@/app/revCard/action";

interface RevenueData {
  totalRevenue: number;
  totalDue: number;
  totalInvoiced: number;
  collectionRate: number;
  averageInvoice: number;
  paymentsByMethod: any;
  recentInvoices: any[];
}



export default async function AdminDashboardPage() {


// Fetch all dashboard data in parallel for better performance
const [total, open, closed, users] = await Promise.all([
  prisma.ticket.count(),
  prisma.ticket.count({ where: { status: "OPEN" } }),
  prisma.ticket.count({ where: { status: "CLOSED" } }),
  prisma.user.count(),
]);

// Fetch the most recent tickets with comprehensive data
  const recentTickets = await prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    take: 10, // Show more recent tickets
    select: {
      id: true,
      device: true,
      deviceSN: true,
      location: true,
      status: true,
      createdAt: true,
      customerName: true,
      description: true,
    },
  });

  // Fetch revenue data - safely handle potential errors
  let revenueData: RevenueData | null = null;
  try {
    // Fetch actual revenue data
    revenueData = await getTotalRevenue() as RevenueData;
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    revenueData = null;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
        <div className="flex gap-2">
          <Link 
            href="/payment/manual" 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
           Process Payment
          </Link>
          <Link 
            href="/revenue" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Full Revenue Report
          </Link>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Tickets" value={total} icon={<TicketIcon />} />
        <MetricCard title="Open Tickets" value={open} icon={<TicketIcon />} />
        <MetricCard title="Closed Tickets" value={closed} icon={<TicketIcon />} />
        <MetricCard title="Active Users" value={users} icon={<UserIcon />} />
      </div>

      {/* Revenue Metrics */}
      {revenueData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Revenue" 
            value={`$${revenueData?.totalRevenue?.toFixed(2) || '0.00'}`} 
            icon={<CurrencyDollarIcon />} 
          />
          <MetricCard 
            title="Outstanding" 
            value={`$${revenueData?.totalDue?.toFixed(2) || '0.00'}`} 
            icon={<ChartBarIcon />} 
          />
          <MetricCard 
            title="Collection Rate" 
            value={`${revenueData?.collectionRate?.toFixed(1) || '0.0'}%`} 
            icon={<ChartBarIcon />} 
          />
          <MetricCard 
            title="Avg Invoice" 
            value={`$${revenueData?.averageInvoice?.toFixed(2) || '0.00'}`} 
            icon={<CurrencyDollarIcon />} 
          />
        </div>
      )}

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ticket Status Summary */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4"> Ticket Status Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{open}</div>
              <div className="text-sm text-green-800">Open Tickets</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-gray-600">{closed}</div>
              <div className="text-sm text-gray-800">Closed Tickets</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Total: </span>{total} tickets
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Completion Rate: </span>
              {total > 0 ? Math.round((closed / total) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Tickets</h2>
          <RecentTickets tickets={recentTickets} />
        </div>
      </div>

      {/* Payment Methods (if revenue data available) */}
      {revenueData && typeof revenueData === 'object' && (revenueData as any).paymentsByMethod && Object.keys((revenueData as any).paymentsByMethod).length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💳 Payment Methods Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries((revenueData as any).paymentsByMethod).map(([method, info]) => {
              const typedInfo = info as { total: number; count: number };
              return (
                <div key={method} className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 capitalize mb-1">
                    {method.toLowerCase().replace('_', ' ')}
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    ${typedInfo.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600">
                    {typedInfo.count} payments
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      {revenueData && typeof revenueData === 'object' && (revenueData as any).recentInvoices && (revenueData as any).recentInvoices.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4"> Recent Invoices</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Customer</th>
                  <th className="text-left py-2">Device</th>
                  <th className="text-right py-2">Total</th>
                  <th className="text-right py-2">Paid</th>
                  <th className="text-right py-2">Due</th>
                  <th className="text-center py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {(revenueData as any).recentInvoices.slice(0, 5).map((invoice: any) => (
                  <tr key={invoice.id} className="border-b border-gray-100">
                    <td className="py-2">{invoice.ticket?.customerName || 'No customer'}</td>
                    <td className="py-2">{invoice.ticket?.device || 'No device'}</td>
                    <td className="py-2 text-right font-semibold">${invoice.total.toFixed(2)}</td>
                    <td className="py-2 text-right text-green-600">${invoice.paidAmount.toFixed(2)}</td>
                    <td className="py-2 text-right text-red-600">${invoice.dueAmount.toFixed(2)}</td>
                    <td className="py-2 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        invoice.dueAmount <= 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {invoice.dueAmount <= 0 ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}