import { Layout as AntLayout } from 'antd';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';

const { Content } = AntLayout;

const Layout = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <AntLayout style={{ marginLeft: 280 }}>
        <Navbar />
        <Content style={{ 
          background: '#f5f5f5',
          marginTop: '64px',
          minHeight: 'calc(100vh - 64px)'
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
