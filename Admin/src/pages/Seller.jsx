// Imports.
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Phone, Store, MapPin, Plus, CreditCard } from "lucide-react";
import { Pagination, ConfigProvider, Button, Spin } from "antd";
import { motion } from "framer-motion";
import { getAllSellers } from "../services/api";
import { colors } from "../styles/colors";

// Frontend.
export default function Seller() {
  // States.
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 9;

  // Fetch sellers.
  const fetchSellers = async () => {
    try {
      setLoading(true);
      const data = await getAllSellers();
      setSellers(data || []);
    } catch (error) {
      console.error("Error fetching sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Loader.
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-96">
          <Spin size="large" />
          <div className="text-lg text-text-secondary mt-4">Loading sellers...</div>
        </div>
      </div>
    );
  }

  // Add empty state.
  if (!loading && sellers.length === 0) {
    return (
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><Users className="w-7 h-7" />All Sellers</h2>
            <p className="text-text-secondary mt-1">Manage and monitor all registered sellers</p>
          </div>
          <Button type="primary" size="large" icon={<Plus className="w-5 h-5" />} onClick={() => navigate("/admin/seller/add")} style={{ backgroundColor: colors.primary, borderColor: colors.primary}}>Add Seller</Button>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="w-16 h-16 text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">No Sellers Found</h3>
          <p className="text-text-secondary mb-6">No sellers have been registered yet.</p>
        </div>
      </div>
    );
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentSellers = sellers.slice(startIndex, endIndex);
  const handlePageChange = (page) => {setCurrentPage(page);};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><Users className="w-7 h-7" />All Sellers</h2>
          <p className="text-text-secondary mt-1">Manage and monitor all registered sellers</p>
        </div>
        <Button type="primary" size="large" icon={<Plus className="w-5 h-5" />} onClick={() => navigate("/admin/seller/add")} style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>Add Seller</Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSellers.map((seller, index) => (
          <motion.div key={seller.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                {seller.profileImage ? (
                  <img src={seller.profileImage} alt={seller.name}className="w-16 h-16 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {seller.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-lg text-gray-900 truncate">{seller.name || 'Unknown Seller'}</h4>
                <p className="text-sm text-gray-500 truncate">{seller.email}</p>
                {seller.shopName && (
                  <div className="flex items-center gap-1 mt-1">
                    <Store className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-medium truncate">{seller.shopName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-100">
              {seller.phone && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">{seller.phone}</span>
                </div>
              )}
              {seller.cnic && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="font-medium">{seller.cnic}</span>
                </div>
              )}
              {seller.address && (
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium truncate">{seller.address}</span>
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment Methods</div>
              <div className="flex flex-wrap gap-2">
                {seller.bankDetail && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    Bank
                  </span>
                )}
                {seller.easypaisaDetail && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    EasyPaisa
                  </span>
                )}
                {seller.jazzcashDetail && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                    JazzCash
                  </span>
                )}
                {!seller.bankDetail && !seller.easypaisaDetail && !seller.jazzcashDetail && (
                  <span className="text-xs text-gray-400 italic">No payment methods</span>
                )}
              </div>
            </div>
          </motion.div>
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
