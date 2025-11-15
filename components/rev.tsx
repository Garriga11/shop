'use client'

import { useEffect, useState } from 'react'
import { getTotalRevenue } from '@/app/revCard/action'

interface RevenueData {
  totalRevenue: number;
  totalDue: number;
  totalInvoiced: number;
  collectionRate: number;
  averageInvoice: number;
  paymentsByMethod: Record<string, { total: number; count: number; }>;
  recentInvoices: any[];
}

export default function RevenueCard() {
  const [revenue, setRevenue] = useState<number>(0)

  useEffect(() => {
    getTotalRevenue().then((data: RevenueData) => {
      setRevenue(data.totalRevenue)
    }).catch(error => {
      console.error('Error fetching revenue:', error)
      setRevenue(0)
    })
  }, [])
  return (
    <div className="p-4 rounded shadow bg-green-100 max-w-sm">
      <h3 className="text-lg font-medium">Total Revenue</h3>
      <p className="text-2xl font-bold text-green-700">
        {revenue !== null ? `$${revenue.toFixed(2)}` : 'Loading...'}
      </p>
    </div>
  )
}
