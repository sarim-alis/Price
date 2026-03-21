// Imports.
import { Layout as AntLayout } from "antd";
import Sidebar from "../Sidebar/Sidebar";

const { Content } = AntLayout;

export default function Layout({ children }) {
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <AntLayout style={{ marginLeft: 260 }}>
        <Content style={{ background: "#f5f5f5" }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
