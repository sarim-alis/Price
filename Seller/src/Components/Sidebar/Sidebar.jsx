// Imports.
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Divider } from "antd";
import { DashboardOutlined, AppstoreOutlined, ShoppingCartOutlined, LogoutOutlined } from "@ant-design/icons";
import { colors } from "../../styles/colors";
import { logout, getUser } from "../../services/auth";

const { Sider } = Layout;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: "/seller/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/seller/products",
      icon: <AppstoreOutlined />,
      label: "Products",
    },
    {
      key: "/seller/orders",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    logout();
    navigate("/seller/login");
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={260}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        <h2 style={{ color: colors.primary, margin: 0, fontSize: collapsed ? "16px" : "20px", fontWeight: "bold" }}>
          {collapsed ? "S" : "Seller"}
        </h2>
      </div>

      <Divider style={{ margin: "0 0 16px 0" }} />

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        items={menuItems}
        style={{
          border: "none",
          fontSize: "15px",
        }}
        theme="light"
        className="custom-menu"
      />

      <style>{`
        .custom-menu .ant-menu-item-selected {
          background-color: ${colors.primary} !important;
          color: white !important;
          font-weight: 600;
        }
        .custom-menu .ant-menu-item-selected .anticon {
          color: white !important;
        }
        .custom-menu .ant-menu-item:hover {
          background-color: ${colors.primary} !important;
          color: white !important;
        }
        .custom-menu .ant-menu-item:hover .anticon {
          color: white !important;
        }
        .custom-menu .ant-menu-item {
          margin: 8px 12px;
          border-radius: 8px;
          height: 48px;
          display: flex;
          align-items: center;
        }
      `}</style>

      {/* User Profile */}
      <div style={{ position: "absolute", bottom: 0, width: "100%", padding: "16px", borderTop: "1px solid #f0f0f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <Avatar
            size={40}
            style={{
              backgroundColor: "#d9d9d9",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </Avatar>
          {!collapsed && (
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#333", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.name || "Seller"}
              </div>
              <div style={{ fontSize: "12px", color: "#999", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.email || "seller@example.com"}
              </div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px 12px",
              background: "transparent",
              border: "1px solid #f0f0f0",
              borderRadius: "6px",
              color: "#ff4d4f",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff1f0";
              e.currentTarget.style.borderColor = "#ff4d4f";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "#f0f0f0";
            }}
          >
            <LogoutOutlined />
            Logout
          </button>
        )}
      </div>
    </Sider>
  );
}
