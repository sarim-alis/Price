// Imports.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, Phone, CreditCard, ArrowLeft } from "lucide-react";
import { Input, Button, Form, message } from "antd";

export default function AddBuyer() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sellers/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Seller created successfully!");
        form.resetFields();
        setTimeout(() => navigate("/admin/seller"), 1500);
      } else {
        message.error(data.message || "Failed to create seller");
      }
    } catch (error) {
      console.error("Error creating seller:", error);
      message.error("Failed to create seller. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/seller")}
          className="flex items-center gap-2 text-text-secondary hover:text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sellers</span>
        </button>
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <UserPlus className="w-7 h-7" />
          Add New Seller
        </h2>
        <p className="text-text-secondary mt-1">Create a new seller account</p>
      </div>

      {/* Form */}
      <div className="bg-surface rounded-xl border border-border p-6 max-w-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* Name */}
          <Form.Item
            label={<span className="text-text-primary font-medium">Full Name</span>}
            name="name"
            rules={[{ required: true, message: "Please enter seller name" }]}
          >
            <Input
              prefix={<UserPlus className="w-4 h-4 text-text-secondary" />}
              placeholder="Enter seller full name"
              size="large"
            />
          </Form.Item>

          {/* Email */}
          <Form.Item
            label={<span className="text-text-primary font-medium">Email Address</span>}
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input
              prefix={<Mail className="w-4 h-4 text-text-secondary" />}
              placeholder="Enter email address"
              size="large"
            />
          </Form.Item>

          {/* Password */}
          <Form.Item
            label={<span className="text-text-primary font-medium">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please enter password" },
              { min: 6, message: "Password must be at least 6 characters" }
            ]}
          >
            <Input.Password
              prefix={<Lock className="w-4 h-4 text-text-secondary" />}
              placeholder="Enter password"
              size="large"
            />
          </Form.Item>

          {/* Phone */}
          <Form.Item
            label={<span className="text-text-primary font-medium">Phone Number</span>}
            name="phone"
            rules={[{ required: false }]}
          >
            <Input
              prefix={<Phone className="w-4 h-4 text-text-secondary" />}
              placeholder="Enter phone number (optional)"
              size="large"
            />
          </Form.Item>

          {/* CNIC */}
          <Form.Item
            label={<span className="text-text-primary font-medium">CNIC Number</span>}
            name="cnic"
            rules={[{ required: false }]}
          >
            <Input
              prefix={<CreditCard className="w-4 h-4 text-text-secondary" />}
              placeholder="Enter CNIC number (optional)"
              size="large"
              maxLength={15}
            />
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <div className="flex gap-3">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  backgroundColor: "#7b5740",
                  borderColor: "#7b5740",
                }}
                className="flex-1"
              >
                Create Seller
              </Button>
              <Button
                type="default"
                size="large"
                onClick={() => navigate("/admin/seller")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
