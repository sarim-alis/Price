// Imports.
import { useNavigate } from "react-router-dom";
import { Users, Smartphone, ShoppingCart, TrendingUp, LogOut, BarChart3, Settings, Bell } from "lucide-react";
import { logout, getUser } from "../services/auth";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Frontend.
export default function Dashboard() {
  // States.
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  // Stats.
  const stats = [
    { title: "Total Users", value: "1,234", icon: Users, color: "bg-info" },
    { title: "Total Mobiles", value: "567", icon: Smartphone, color: "bg-success" },
    { title: "Total Orders", value: "890", icon: ShoppingCart, color: "bg-warning" },
    { title: "Revenue", value: "₨ 1.2M", icon: TrendingUp, color: "bg-primary" },
  ];

  const monthlyData = [
    { month: 'Jan', users: 400, mobiles: 240, orders: 340, revenue: 120000 },
    { month: 'Feb', users: 600, mobiles: 300, orders: 450, revenue: 180000 },
    { month: 'Mar', users: 800, mobiles: 400, orders: 600, revenue: 250000 },
    { month: 'Apr', users: 1000, mobiles: 450, orders: 750, revenue: 320000 },
    { month: 'May', users: 1100, mobiles: 500, orders: 800, revenue: 400000 },
    { month: 'Jun', users: 1234, mobiles: 567, orders: 890, revenue: 500000 },
  ];

  const pieData = [
    { name: 'Users', value: 1234, color: '#2196F3' },
    { name: 'Mobiles', value: 567, color: '#4CAF50' },
    { name: 'Orders', value: 890, color: '#FFC107' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="p-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name || "Admin"}!</h2>
          <p className="text-text-secondary mt-1">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-surface rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <BarChart3 className="w-5 h-5 text-text-muted" />
              </div>
              <h3 className="text-text-secondary text-sm">{stat.title}</h3>
              <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Monthly Overview */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#2196F3" name="Users" />
                <Bar dataKey="mobiles" fill="#4CAF50" name="Mobiles" />
                <Bar dataKey="orders" fill="#FFC107" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart - Distribution */}
          <div className="bg-surface rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-text-primary mb-4">Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={100} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Revenue Trend */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#7b5740" strokeWidth={2} name="Revenue (₨)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
