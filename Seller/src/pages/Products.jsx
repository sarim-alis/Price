// Imports.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button, Pagination, ConfigProvider } from "antd";
import { colors } from "../styles/colors";

export default function Products() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Dummy products data
  const products = [
    { id: 1, name: "iPhone 14 Pro Max", brand: "Apple", price: "₨ 425,000", stock: 12, status: "Active", image: "📱" },
    { id: 2, name: "Samsung Galaxy S23 Ultra", brand: "Samsung", price: "₨ 389,000", stock: 8, status: "Active", image: "📱" },
    { id: 3, name: "Google Pixel 8 Pro", brand: "Google", price: "₨ 285,000", stock: 5, status: "Active", image: "📱" },
    { id: 4, name: "OnePlus 12", brand: "OnePlus", price: "₨ 195,000", stock: 15, status: "Active", image: "📱" },
    { id: 5, name: "Xiaomi 14 Pro", brand: "Xiaomi", price: "₨ 165,000", stock: 0, status: "Out of Stock", image: "📱" },
    { id: 6, name: "Oppo Find X7", brand: "Oppo", price: "₨ 145,000", stock: 10, status: "Active", image: "📱" },
    { id: 7, name: "Vivo X100 Pro", brand: "Vivo", price: "₨ 175,000", stock: 7, status: "Active", image: "📱" },
    { id: 8, name: "Realme GT 5 Pro", brand: "Realme", price: "₨ 125,000", stock: 20, status: "Active", image: "📱" },
    { id: 9, name: "Nothing Phone 2", brand: "Nothing", price: "₨ 155,000", stock: 3, status: "Low Stock", image: "📱" },
  ];

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Package className="w-7 h-7" />
            My Products
          </h2>
          <p className="text-text-secondary mt-1">Manage your product listings</p>
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <div key={product.id} className="bg-surface rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="flex items-center justify-center w-full h-32 bg-background rounded-lg mb-4 text-6xl">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="mb-4">
              <h4 className="font-semibold text-text-primary text-lg mb-1">{product.name}</h4>
              <p className="text-text-secondary text-sm mb-2">{product.brand}</p>
              <div className="flex items-center justify-between">
                <span className="text-primary font-bold text-xl">{product.price}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  product.status === 'Active' ? 'bg-success/10 text-success' : 
                  product.status === 'Low Stock' ? 'bg-warning/10 text-warning' : 
                  'bg-error/10 text-error'
                }`}>
                  {product.status}
                </span>
              </div>
            </div>

            {/* Stock Info */}
            <div className="mb-4 pb-4 border-b border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">Stock:</span>
                <span className="font-semibold text-text-primary">{product.stock} units</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors">
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit</span>
              </button>
              <button className="flex items-center justify-center px-3 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <ConfigProvider theme={{token: { colorPrimary: colors.primary, colorPrimaryHover: colors.primaryDark }}}>
          <Pagination 
            current={currentPage} 
            total={products.length} 
            pageSize={pageSize} 
            onChange={handlePageChange} 
            showSizeChanger={false} 
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`} 
          />
        </ConfigProvider>
      </div>
    </div>
  );
}
