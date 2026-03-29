// Imports.
import { Layout, Menu, Avatar, Button, Divider } from 'antd';
import { AppstoreOutlined, MoreOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../../services/auth';
import { colors } from '../../styles/colors';
const { Sider } = Layout;

// Frontend.
const Sidebar = () => {
  // States.
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  // Menu items.
  const menuItems = [
    { key: '/admin/dashboard', icon: <AppstoreOutlined />, label: 'Dashboard' },
    { key: '/admin/seller',    icon: <UserOutlined />,     label: 'Sellers'   },
    { key: '/admin/buyer',     icon: <TeamOutlined />,     label: 'Buyers'    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key) {
      navigate(key);
    }
  };

  return (
    <Sider width={280} style={{ height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0, background: '#fff', borderRight: '1px solid #f0f0f0', overflow: 'auto' }} collapsible={false}>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src="/cell.svg" size={40} />
          <h1 className="text-xl font-bold text-primary">Zod Mobile</h1>
        </div>

        {/* Menu */}
        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} onClick={handleMenuClick} style={{ border: 'none', flex: 1, '--ant-menu-item-selected-bg': colors.primary, '--ant-menu-item-selected-color': colors.textLight, '--ant-menu-item-hover-bg': colors.primaryDark, '--ant-menu-item-hover-color': colors.textLight, '--ant-menu-item-padding-inline': '32px', '--ant-menu-item-height': '64px', '--ant-menu-icon-size': '20px', '--ant-menu-item-font-size': '16px', '--ant-menu-item-margin-block': '8px' }}  />
        <div style={{ flex: 1 }} />
        <Divider style={{ margin: '16px 0' }} />

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar size={40} style={{  backgroundColor: '#f0f0f0',  color: '#595959', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }} >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500, fontSize: '14px' }}>{user?.name || 'John Doe'}</div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{user?.email || 'john@example.com'}</div>
            </div>
          </div>
          <Button type="text" icon={<MoreOutlined />} />
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;