import { getTotalRevenue } from "./action";

function Total({ totalRevenue }: { totalRevenue: number }) {
  return <div>Total Revenue: {totalRevenue}</div>;
}

export default async function RevenuePage() {
  const revenueData = await getTotalRevenue();

  
  return (
    <main className="space-y-6 p-6">
      <Total totalRevenue={revenueData.totalRevenue} />
      {/* other components like AccountForm */}
    </main>
  )
}
