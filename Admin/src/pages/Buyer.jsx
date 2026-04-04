// Imports.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Mail, Phone, ShoppingBag, Calendar, Plus } from "lucide-react";
import { Pagination, ConfigProvider, Button, Spin } from "antd";
import { motion } from "framer-motion";
import { getAllBuyers } from "../services/api";
import { colors } from "../styles/colors";

// Frontend.
export default function Buyer() {
  // States.
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  // Fetch buyers.
  const fetchBuyers = async () => {
    try {
      setLoading(true);
      const data = await getAllBuyers();
      setBuyers(data || []);
    } catch (error) {
      console.error("Error fetching buyers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuyers();
  }, []);

  // Loader.
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <Spin size="large" />
          <div className="text-lg text-text-secondary mt-4">Loading buyers...</div>
        </div>
      </div>
    );
  }

  // Add empty state.
  if (!loading && buyers.length === 0) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><Users className="w-7 h-7" />All Buyers</h2>
            <p className="text-text-secondary mt-1">Manage and monitor all registered sellers</p>
          </div>
          <Button type="primary" size="large" icon={<Plus className="w-5 h-5" />} onClick={() => navigate("/admin/buyer/add")} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>Add Buyer</Button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="w-16 h-16 text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Buyers Found</h3>
          <p className="text-text-secondary mb-6">No buyers have been registered yet.</p>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentBuyers = buyers.slice(startIndex, endIndex);
  const handlePageChange = (page) => {setCurrentPage(page);};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><Users className="w-7 h-7" />All Buyers</h2>
          <p className="text-text-secondary mt-1">Manage and monitor all registered buyers</p>
        </div>
        <Button type="primary" size="large" icon={<Plus className="w-5 h-5" />} onClick={() => navigate("/admin/buyer/add")} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>Add Buyer</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBuyers.map((buyer, index) => (
          <motion.div key={buyer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                {buyer.profileImage ? (
                  <img src={buyer.profileImage} alt={buyer.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"/>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {buyer.name?.charAt(0).toUpperCase() || 'B'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-gray-900 truncate">{buyer.name || 'Unknown Buyer'}</h4>
                <p className="text-sm text-gray-500 truncate">{buyer.email}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ShoppingBag className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">Buyer Account</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-100">
              {buyer.phone && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{buyer.phone}</span>
                </div>
              )}
              {buyer.email && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium truncate">{buyer.email}</span>
                </div>
              )}
            </div>

            {/* Member Since */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Member Info</div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <span className="font-medium">
                  Joined {new Date(buyer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ConfigProvider theme={{token: { colorPrimary: colors.primary, colorPrimaryHover: colors.primaryDark }}}>
          <Pagination current={currentPage} total={buyers.length} pageSize={pageSize} onChange={handlePageChange} showSizeChanger={false} showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} buyers`} />
        </ConfigProvider>
      </div>
    </div>
  );
}
