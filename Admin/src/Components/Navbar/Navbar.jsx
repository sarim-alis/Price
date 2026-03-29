// Imports.
import { Layout, Avatar, Button, Space, Dropdown, Badge } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../services/auth';
import { colors } from '../../styles/colors';

const { Header } = Layout;

// Frontend.
const Navbar = () => {
  // States.
  const navigate = useNavigate();
  const user = getUser();

  // Handle logout.
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // Dropdown menu items.
  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/admin/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/admin/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header 
      style={{ 
        background: '#fff', 
        padding: '0 24px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        right: 0,
        left: 280,
        zIndex: 1000,
        height: '64px'
      }}
    >
      {/* Left side - Breadcrumb or page title can go here */}
      <div style={{ flex: 1 }} />

      {/* Right side - User actions */}
      <Space size="middle">
        {/* <Badge count={3} size="small">
          <Button 
            type="text" 
            icon={<Bell className="w-5 h-5" />} 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              padding: '8px',
              color: colors.textSecondary
            }}
          />
        </Badge> */}

        {/* User dropdown */}
        <Dropdown 
          menu={{ items: menuItems }} 
          placement="bottomRight"
          trigger={['click']}
        >
          <Button 
            type="text" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '4px 8px',
              height: 'auto'
            }}
          >
            <Avatar 
              size={32} 
              style={{ 
                backgroundColor: colors.primary,
                color: colors.textLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
            <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
              <div style={{ 
                fontWeight: 500, 
                fontSize: '14px', 
                color: colors.textPrimary,
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.name || 'Admin User'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: colors.textSecondary,
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {user?.email || 'admin@example.com'}
              </div>
            </div>
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default Navbar;
