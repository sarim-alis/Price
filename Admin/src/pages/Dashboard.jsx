// Imports.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Smartphone, ShoppingCart, TrendingUp, LogOut, BarChart3, Settings, Bell } from "lucide-react";
import { logout, getUser } from "../services/auth";
import { getDashboardStats } from "../services/api";
import { Spin } from "antd";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Frontend.
export default function Dashboard() {
  // States.
  const navigate = useNavigate();
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Stats - Using real data from backend
  const stats = [
    { title: "Total Users", value: dashboardData?.stats?.totalUsers || 0, icon: Users, color: "bg-info" },
    { title: "Total Buyers", value: dashboardData?.stats?.totalBuyers || 0, icon: ShoppingCart, color: "bg-success" },
    { title: "Total Sellers", value: dashboardData?.stats?.totalSellers || 0, icon: TrendingUp, color: "bg-warning" },
    { title: "Total Mobiles", value: dashboardData?.stats?.totalMobiles || 0, icon: Smartphone, color: "bg-primary" },
  ];

  // Format monthly data for charts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyUsersData = dashboardData?.monthlyData?.users || [];
  const monthlyMobilesData = dashboardData?.monthlyData?.mobiles || [];

  // Combine and format monthly data
  const monthlyData = monthlyUsersData.map((item, index) => {
    const monthName = monthNames[item._id.month - 1];
    const mobileItem = monthlyMobilesData.find(m => m._id.month === item._id.month && m._id.year === item._id.year);
    return {
      month: monthName,
      users: item.count,
      mobiles: mobileItem?.count || 0
    };
  });

  const pieData = [
    { name: 'Buyers', value: dashboardData?.stats?.totalBuyers || 0, color: '#2196F3' },
    { name: 'Sellers', value: dashboardData?.stats?.totalSellers || 0, color: '#4CAF50' },
    { name: 'Mobiles', value: dashboardData?.stats?.totalMobiles || 0, color: '#FFC107' },
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
      </div>
    </div>
  );
}
