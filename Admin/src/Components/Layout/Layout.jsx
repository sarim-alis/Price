import { Layout as AntLayout } from 'antd';
import Sidebar from '../Sidebar/Sidebar';

const { Content } = AntLayout;

const Layout = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sidebar />
      <AntLayout style={{ marginLeft: 280 }}>
        <Content style={{ background: '#f5f5f5' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
