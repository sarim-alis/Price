import { useNavigate } from "react-router-dom";
import { Smartphone, ShoppingCart, TrendingUp, Package, Plus } from "lucide-react";
import { Button } from "antd";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { colors } from "../styles/colors";

export default function Dashboard() {
  const navigate = useNavigate();

  const stats = [
    { title: "Active Listings", value: "24", icon: Smartphone, color: "bg-info" },
    { title: "Total Sales", value: "156", icon: ShoppingCart, color: "bg-success" },
    { title: "Pending Orders", value: "8", icon: Package, color: "bg-warning" },
    { title: "Revenue", value: "₨ 245K", icon: TrendingUp, color: "bg-primary" },
  ];

  // Chart data
  const monthlySales = [
    { month: "Jan", sales: 45 },
    { month: "Feb", sales: 52 },
    { month: "Mar", sales: 61 },
    { month: "Apr", sales: 58 },
    { month: "May", sales: 70 },
    { month: "Jun", sales: 68 },
  ];

  const productDistribution = [
    { name: "Apple", value: 35 },
    { name: "Samsung", value: 28 },
    { name: "Google", value: 15 },
    { name: "OnePlus", value: 12 },
    { name: "Others", value: 10 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 185 },
    { month: "Feb", revenue: 210 },
    { month: "Mar", revenue: 245 },
    { month: "Apr", revenue: 230 },
    { month: "May", revenue: 280 },
    { month: "Jun", revenue: 265 },
  ];

  const COLORS = [colors.primary, colors.info, colors.success, colors.warning, colors.error];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
          <p className="text-text-secondary mt-1">Track your sales and manage your listings</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate("/seller/add-product")}
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
        >
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-surface rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-text-secondary text-sm">{stat.title}</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Sales Chart */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Sales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill={colors.primary} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Distribution Chart */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Product Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {productDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Trend (₨ Thousands)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke={colors.success} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
