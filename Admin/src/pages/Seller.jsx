// Imports.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Phone, Package, ShoppingCart, TrendingUp, Plus } from "lucide-react";
import { Pagination, ConfigProvider, Button } from "antd";
import { colors } from "../styles/colors";

// Frontend.
export default function Seller() {
  // States.
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 6;

  // Fetch sellers from API
  const fetchSellers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sellers/all`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSellers(data.sellers || []);
      } else {
        console.error("Failed to fetch sellers");
      }
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sellers on component mount
  useEffect(() => {
    fetchSellers();
  }, []);

  // Add loading state display
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-text-secondary">Loading sellers...</div>
        </div>
      </div>
    );
  }

  // Add empty state display
  if (!loading && sellers.length === 0) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><Users className="w-7 h-7" />All Sellers</h2>
            <p className="text-text-secondary mt-1">Manage and monitor all registered sellers</p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => navigate("/admin/seller/add")}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Add Seller
          </Button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="w-16 h-16 text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Sellers Found</h3>
          <p className="text-text-secondary mb-6">No sellers have been registered yet.</p>
          <Button
            type="primary"
            size="large"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => navigate("/admin/seller/add")}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
            }}
          >
            Add First Seller
          </Button>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSellers = sellers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><Users className="w-7 h-7" />All Sellers</h2>
          <p className="text-text-secondary mt-1">Manage and monitor all registered sellers</p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<Plus className="w-5 h-5" />}
          onClick={() => navigate("/admin/seller/add")}
          style={{
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }}
        >
          Add Seller
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSellers.map((seller) => (
          <div key={seller.id} className="bg-surface rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Card */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{seller.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${seller.isVerified ? 'bg-success/10 text-success' : 'bg-warning/10 text-success'}`}>
                    {seller.isVerified ? 'Verified' : 'Verified'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-warning">
                <span className="text-sm font-semibold">★ {seller.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Mail className="w-4 h-4" />
                <span className="truncate">{seller.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Phone className="w-4 h-4" />
                <span>{seller.phone || 'Not provided'}</span>
              </div>
              {seller.cnic && (
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Package className="w-4 h-4" />
                  <span className="truncate">CNIC: {seller.cnic}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-xs text-text-secondary mb-1">Badge</div>
                <div className="text-sm font-bold text-text-primary capitalize">{seller.badge}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-text-secondary mb-1">Fraud Score</div>
                <div className="text-sm font-bold text-text-primary">{seller.fraudScore}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ConfigProvider theme={{token: { colorPrimary: colors.primary, colorPrimaryHover: colors.primaryDark }}}>
          <Pagination current={currentPage} total={sellers.length} pageSize={pageSize} onChange={handlePageChange} showSizeChanger={false} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} sellers`} />
        </ConfigProvider>
      </div>
    </div>
  );
}
