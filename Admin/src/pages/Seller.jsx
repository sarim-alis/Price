// Imports.
import { Users, Mail, Phone, Package, ShoppingCart, TrendingUp } from "lucide-react";

export default function Seller() {
  const sellers = [
    { id: 1, name: "Ahmed Khan", email: "ahmed.khan@email.com", phone: "+92 300 1234567", products: 45, sales: 234, revenue: "₨ 125K", rating: 4.8, status: "Active" },
    { id: 2, name: "Sara Ali", email: "sara.ali@email.com", phone: "+92 301 2345678", products: 32, sales: 189, revenue: "₨ 98K", rating: 4.6, status: "Active" },
    { id: 3, name: "Hassan Raza", email: "hassan.raza@email.com", phone: "+92 302 3456789", products: 28, sales: 156, revenue: "₨ 87K", rating: 4.5, status: "Active" },
    { id: 4, name: "Fatima Noor", email: "fatima.noor@email.com", phone: "+92 303 4567890", products: 38, sales: 201, revenue: "₨ 110K", rating: 4.7, status: "Active" },
    { id: 5, name: "Ali Haider", email: "ali.haider@email.com", phone: "+92 304 5678901", products: 25, sales: 142, revenue: "₨ 76K", rating: 4.4, status: "Inactive" },
    { id: 6, name: "Ayesha Malik", email: "ayesha.malik@email.com", phone: "+92 305 6789012", products: 41, sales: 218, revenue: "₨ 118K", rating: 4.9, status: "Active" },
    { id: 7, name: "Usman Ahmed", email: "usman.ahmed@email.com", phone: "+92 306 7890123", products: 19, sales: 98, revenue: "₨ 52K", rating: 4.2, status: "Active" },
    { id: 8, name: "Zainab Shah", email: "zainab.shah@email.com", phone: "+92 307 8901234", products: 35, sales: 176, revenue: "₨ 95K", rating: 4.6, status: "Active" },
    { id: 9, name: "Bilal Hussain", email: "bilal.hussain@email.com", phone: "+92 308 9012345", products: 29, sales: 164, revenue: "₨ 89K", rating: 4.5, status: "Inactive" },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Users className="w-7 h-7" />
          All Sellers
        </h2>
        <p className="text-text-secondary mt-1">Manage and monitor all registered sellers</p>
      </div>

      {/* Sellers Grid - 3x3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellers.map((seller) => (
          <div key={seller.id} className="bg-surface rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            {/* Seller Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {seller.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">{seller.name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${seller.status === 'Active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                    {seller.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-warning">
                <span className="text-sm font-semibold">★ {seller.rating}</span>
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
                <span>{seller.phone}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Package className="w-4 h-4 text-info" />
                </div>
                <div className="text-xs text-text-secondary mb-1">Products</div>
                <div className="text-lg font-bold text-text-primary">{seller.products}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <ShoppingCart className="w-4 h-4 text-success" />
                </div>
                <div className="text-xs text-text-secondary mb-1">Sales</div>
                <div className="text-lg font-bold text-text-primary">{seller.sales}</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="text-xs text-text-secondary mb-1">Revenue</div>
                <div className="text-lg font-bold text-text-primary">{seller.revenue}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
