import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { FaDollarSign, FaUser, FaChartLine, FaBox } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

function KPICard({ title, value, icon, chart }) {
  return (
    <div
      className="kpi-card"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minWidth: "100px",
        padding: "20px",
        backgroundColor: "var(--cardBg)",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: `1px solid var(--borderColor)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h4 style={{ margin: 0, fontSize: "16px" }}>{title}</h4>
          <p style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>{value}</p>
        </div>
        <div style={{ fontSize: "30px" }}>{icon}</div>
      </div>
      {chart && <div style={{ marginTop: "10px" }}>{chart}</div>}
    </div>
  );
}

function Analytics() {
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);

  const { products } = useOutletContext();

  useEffect(() => {
    if (!products || products.length === 0) return;

    const monthlyRevenueTotals = {};
    const customerGrowthData = {};
    const categoryTotals = {};
    const productsRevenue = products.map((p) => {
      const totalRevenue = p.sales.reduce((sum, s) => sum + s.unitsSold * p.price, 0);

      // category revenue
      categoryTotals[p.category] = (categoryTotals[p.category] || 0) + totalRevenue;

      // customer growth
      p.sales.forEach((s) => {
        const month = s.date.substring(0, 7);
        monthlyRevenueTotals[month] = (monthlyRevenueTotals[month] || 0) + totalRevenue;
        customerGrowthData[month] = (customerGrowthData[month] || 0) + 1;
      });

      return { name: p.name, revenue: totalRevenue };
    });

    setMonthlyRevenue(
      Object.keys(monthlyRevenueTotals).map((m) => ({ month: m, revenue: monthlyRevenueTotals[m] }))
    );

    setTopProducts(productsRevenue.sort((a, b) => b.revenue - a.revenue).slice(0, 5));

    setCustomerGrowth(
      Object.keys(customerGrowthData).map((m) => ({ month: m, customers: customerGrowthData[m] }))
    );

    setSalesByCategory(
      Object.keys(categoryTotals).map((c) => ({ category: c, sales: categoryTotals[c] }))
    );
  }, [products]);

  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);
  const totalCustomers = customerGrowth.reduce((sum, c) => sum + c.customers, 0);
  const topProduct = topProducts[0]?.name || "-";

  return (
    <div style={{ padding: "20px" }}>
      <h1>Sales & Performance Analytics</h1>

      {/* KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >
        <KPICard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          chart={
            <ResponsiveContainer width="100%" height={50}>
              <LineChart data={monthlyRevenue}>
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          }
        />
        <KPICard
          title="Total Customers"
          value={totalCustomers}
          icon={<FaUser />}
          chart={
            <ResponsiveContainer width="100%" height={50}>
              <AreaChart data={customerGrowth}>
                <Area type="monotone" dataKey="customers" stroke="#F59E0B" fill="rgba(245,158,11,0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          }
        />
        <KPICard title="Top Product" value={topProduct} icon={<FaChartLine />} />
        <KPICard title="Categories Sold" value={salesByCategory.length} icon={<FaBox />} />
      </div>

      {/* Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Monthly Revenue */}
        <div className="card" style={{ background: "var(--cardBg)", padding: "20px", borderRadius: "12px" }}>
          <h3>Monthly Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="card" style={{ background: "var(--cardBg)", padding: "20px", borderRadius: "12px" }}>
          <h3>Top 5 Products by Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" radius={5} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Customer Growth */}
        <div className="card" style={{ background: "var(--cardBg)", padding: "20px", borderRadius: "12px" }}>
          <h3>Customer Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={customerGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area dataKey="customers" stroke="#F59E0B" fill="rgba(245,158,11,0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category */}
        <div className="card" style={{ background: "var(--cardBg)", padding: "20px", borderRadius: "12px" }}>
          <h3>Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={salesByCategory} dataKey="sales" nameKey="category" outerRadius={80} label>
                {salesByCategory.map((_, i) => (
                  <Cell key={i} fill={colors[i % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
