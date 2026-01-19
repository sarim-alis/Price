import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Card,
  Row,
  Col,
  message,
  Divider,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { getToken } from "../services/auth";
import { uploadImage } from "../services/cloudinary";

const { TextArea } = Input;
const { Option } = Select;

export default function AddProduct() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch("http://localhost:5000/api/mobiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          images: fileList.map((f) => f.url || f.thumbUrl || ""),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      message.success("Product added successfully!");
      navigate("/seller/dashboard");
    } catch (error) {
      message.error(error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true);
    try {
      const result = await uploadImage(file);
      onSuccess({ url: result.url, publicId: result.publicId });
      message.success(`${file.name} uploaded successfully`);
    } catch (error) {
      onError(error);
      message.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/seller/dashboard")}
          className="mb-4"
        >
          Back to Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-text-primary">Add New Product</h1>
        <p className="text-text-secondary">Fill in the details to list your mobile phone</p>
      </div>

      <Card className="max-w-4xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            condition: "used",
            status: "active",
            stock: 1,
          }}
        >
          {/* Basic Info */}
          <Divider titlePlacement="left">Basic Information</Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="brand"
                label="Brand"
                rules={[{ required: true, message: "Please enter brand" }]}
              >
                <Select placeholder="Select brand">
                  <Option value="apple">Apple</Option>
                  <Option value="samsung">Samsung</Option>
                  <Option value="xiaomi">Xiaomi</Option>
                  <Option value="oppo">Oppo</Option>
                  <Option value="vivo">Vivo</Option>
                  <Option value="realme">Realme</Option>
                  <Option value="oneplus">OnePlus</Option>
                  <Option value="huawei">Huawei</Option>
                  <Option value="google">Google</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="model"
                label="Model"
                rules={[{ required: true, message: "Please enter model" }]}
              >
                <Input placeholder="e.g. iPhone 15 Pro Max" />
              </Form.Item>
            </Col>
          </Row>

          {/* Specs */}
          <Divider titlePlacement="left">Specifications</Divider>
          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                name="ram"
                label="RAM (GB)"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={1} max={32} className="w-full" placeholder="8" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="storage"
                label="Storage (GB)"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={8} max={2048} className="w-full" placeholder="256" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="screenSize"
                label="Screen Size (inches)"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={4} max={8} step={0.1} className="w-full" placeholder="6.7" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="battery"
                label="Battery (mAh)"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={1000} max={10000} className="w-full" placeholder="5000" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={12} md={6}>
              <Form.Item
                name="frontCamera"
                label="Front Camera (MP)"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={1} max={200} className="w-full" placeholder="12" />
              </Form.Item>
            </Col>
            <Col xs={12} md={6}>
              <Form.Item
                name="rearCamera"
                label="Rear Camera (MP)"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber min={1} max={200} className="w-full" placeholder="48" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="processor"
                label="Processor"
                rules={[{ required: true, message: "Please enter processor" }]}
              >
                <Input placeholder="e.g. Snapdragon 8 Gen 3" />
              </Form.Item>
            </Col>
          </Row>

          {/* Condition & Pricing */}
          <Divider titlePlacement="left">Condition & Pricing</Divider>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="condition"
                label="Condition"
                rules={[{ required: true, message: "Required" }]}
              >
                <Select>
                  <Option value="new">New</Option>
                  <Option value="used">Used</Option>
                  <Option value="refurbished">Refurbished</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="price"
                label="Price (PKR)"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  formatter={(value) => `₨ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/₨\s?|(,*)/g, "")}
                  placeholder="150000"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="stock" label="Stock Quantity">
                <InputNumber min={1} max={100} className="w-full" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="location" label="Location">
                <Input placeholder="e.g. Lahore, Pakistan" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="status" label="Status">
                <Select>
                  <Option value="active">Active</Option>
                  <Option value="inactive">Inactive</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Images */}
          <Divider titlePlacement="left">Images</Divider>
          <Form.Item label="Product Images">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              customRequest={customUpload}
              maxCount={5}
              disabled={uploading}
            >
              {fileList.length < 5 && (
                <div>
                  {uploading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div className="mt-2">{uploading ? 'Uploading...' : 'Upload'}</div>
                </div>
              )}
            </Upload>
            <p className="text-text-muted text-sm">Upload up to 5 images</p>
          </Form.Item>

          {/* Submit */}
          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="bg-primary hover:bg-primary-dark"
              style={{ backgroundColor: "#7b5740", borderColor: "#7b5740" }}
            >
              Add Product
            </Button>
            <Button
              size="large"
              className="ml-4"
              onClick={() => navigate("/seller/dashboard")}
            >
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
