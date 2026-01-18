import { useNavigate } from "react-router-dom";
import { Smartphone, ShoppingCart, TrendingUp, LogOut, BarChart3, Settings, Bell, Plus, Package } from "lucide-react";
import { logout, getUser } from "../services/auth";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  const stats = [
    { title: "Active Listings", value: "24", icon: Smartphone, color: "bg-info" },
    { title: "Total Sales", value: "156", icon: ShoppingCart, color: "bg-success" },
    { title: "Pending Orders", value: "8", icon: Package, color: "bg-warning" },
    { title: "Revenue", value: "₨ 245K", icon: TrendingUp, color: "bg-primary" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="bg-surface border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Seller Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-background rounded-lg text-text-secondary">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-background rounded-lg text-text-secondary">
              <Settings className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-border" />
            <span className="text-text-secondary text-sm">{user?.name || "Seller"}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="p-6">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Welcome back, {user?.name || "Seller"}!</h2>
            <p className="text-text-secondary mt-1">Manage your listings and track your sales.</p>
          </div>
          <button
            onClick={() => navigate("/seller/add-product")}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Listing
          </button>
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

        {/* Quick Actions */}
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/seller/add-product")}
              className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl hover:border-primary border border-border transition-colors"
            >
              <Plus className="w-8 h-8 text-primary" />
              <span className="text-sm text-text-primary font-medium">Add Listing</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl hover:border-primary border border-border transition-colors">
              <Smartphone className="w-8 h-8 text-primary" />
              <span className="text-sm text-text-primary font-medium">My Listings</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl hover:border-primary border border-border transition-colors">
              <Package className="w-8 h-8 text-primary" />
              <span className="text-sm text-text-primary font-medium">Orders</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-background rounded-xl hover:border-primary border border-border transition-colors">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span className="text-sm text-text-primary font-medium">Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
