// Imports.
import { useState } from "react";
import { ShoppingCart, Package, Truck, CheckCircle, Clock } from "lucide-react";
import { Pagination, ConfigProvider } from "antd";
import { colors } from "../styles/colors";

export default function Orders() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Dummy orders data
  const orders = [
    { id: "ORD-001", customer: "Ali Ahmed", product: "iPhone 14 Pro Max", quantity: 1, total: "₨ 425,000", status: "Pending", date: "2024-03-20" },
    { id: "ORD-002", customer: "Sara Khan", product: "Samsung Galaxy S23", quantity: 2, total: "₨ 778,000", status: "Processing", date: "2024-03-19" },
    { id: "ORD-003", customer: "Hassan Raza", product: "Google Pixel 8", quantity: 1, total: "₨ 285,000", status: "Shipped", date: "2024-03-18" },
    { id: "ORD-004", customer: "Fatima Noor", product: "OnePlus 12", quantity: 1, total: "₨ 195,000", status: "Delivered", date: "2024-03-17" },
    { id: "ORD-005", customer: "Usman Ali", product: "Xiaomi 14 Pro", quantity: 3, total: "₨ 495,000", status: "Pending", date: "2024-03-16" },
    { id: "ORD-006", customer: "Ayesha Malik", product: "Oppo Find X7", quantity: 1, total: "₨ 145,000", status: "Processing", date: "2024-03-15" },
    { id: "ORD-007", customer: "Bilal Hussain", product: "Vivo X100 Pro", quantity: 2, total: "₨ 350,000", status: "Shipped", date: "2024-03-14" },
    { id: "ORD-008", customer: "Zainab Shah", product: "Realme GT 5 Pro", quantity: 1, total: "₨ 125,000", status: "Delivered", date: "2024-03-13" },
    { id: "ORD-009", customer: "Ahmed Raza", product: "Nothing Phone 2", quantity: 1, total: "₨ 155,000", status: "Pending", date: "2024-03-12" },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="w-4 h-4" />;
      case "Processing": return <Package className="w-4 h-4" />;
      case "Shipped": return <Truck className="w-4 h-4" />;
      case "Delivered": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-warning/10 text-warning";
      case "Processing": return "bg-info/10 text-info";
      case "Shipped": return "bg-primary/10 text-primary";
      case "Delivered": return "bg-success/10 text-success";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <ShoppingCart className="w-7 h-7" />
          Orders
        </h2>
        <p className="text-text-secondary mt-1">Track and manage your orders</p>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentOrders.map((order) => (
          <div key={order.id} className="bg-surface rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Order Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div>
                <h4 className="font-bold text-text-primary text-lg">{order.id}</h4>
                <p className="text-text-secondary text-sm">{order.date}</p>
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="text-xs font-semibold">{order.status}</span>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <p className="text-text-secondary text-sm mb-1">Customer</p>
              <p className="font-semibold text-text-primary">{order.customer}</p>
            </div>

            {/* Product Info */}
            <div className="mb-4">
              <p className="text-text-secondary text-sm mb-1">Product</p>
              <p className="font-semibold text-text-primary">{order.product}</p>
            </div>

            {/* Order Details */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <div>
                <p className="text-text-secondary text-sm">Quantity</p>
                <p className="font-semibold text-text-primary">{order.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-text-secondary text-sm">Total</p>
                <p className="font-bold text-primary text-lg">{order.total}</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ConfigProvider theme={{token: { colorPrimary: colors.primary, colorPrimaryHover: colors.primaryDark }}}>
          <Pagination 
            current={currentPage} 
            total={orders.length} 
            pageSize={pageSize} 
            onChange={handlePageChange} 
            showSizeChanger={false} 
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} orders`} 
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
