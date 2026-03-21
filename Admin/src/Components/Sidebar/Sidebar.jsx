import { useState } from 'react';
import { Layout, Menu, Input, Avatar, Button, Divider } from 'antd';
import { AppstoreOutlined, PieChartOutlined, FileOutlined, ClockCircleOutlined, BookOutlined, QuestionCircleOutlined, SettingOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUser } from '../../services/auth';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <AppstoreOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/admin/analysis',
      icon: <PieChartOutlined />,
      label: 'Analysis',
    },
    {
      key: 'documents',
      icon: <FileOutlined />,
      label: 'Documents',
      children: [
        { key: '/admin/documents/resumes', label: 'Resumes' },
        { key: '/admin/documents/cover-letter', label: 'Cover Letter' },
        { key: '/admin/documents/personal', label: 'Personal' },
        { key: '/admin/documents/education', label: 'Education' },
      ],
    },
    {
      key: '/admin/history',
      icon: <ClockCircleOutlined />,
      label: 'History',
    },
    {
      key: '/admin/favorites',
      icon: <BookOutlined />,
      label: 'Favorites',
    },
  ];

  const bottomMenuItems = [
    {
      key: '/admin/help',
      icon: <QuestionCircleOutlined />,
      label: 'Help Center',
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key !== 'documents') {
      navigate(key);
    }
  };

  return (
    <Sider
      width={280}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#fff',
        borderRight: '1px solid #f0f0f0',
        overflow: 'auto',
      }}
      collapsible={false}
    >
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Logo */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar src="/cell.svg" size={40} />
          <h1 className="text-xl font-bold text-primary">Zod Mobile</h1>
        </div>

        {/* Main Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', flex: 1 }}
        />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Divider */}
        <Divider style={{ margin: '16px 0' }} />

        {/* Bottom Menu */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={bottomMenuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />

        {/* Divider */}
        <Divider style={{ margin: '16px 0' }} />

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              size={40} 
              style={{ 
                backgroundColor: '#f0f0f0', 
                color: '#595959',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}
            >
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