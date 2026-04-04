// Imports.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, Phone, ArrowLeft } from "lucide-react";
import { Input, Button, Form, message } from "antd";

// Frontend.
export default function AddBuyer() {
  // States.
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Handle submit.
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ ...values, role: "buyer"})});
      const data = await response.json();

      if (response.ok) {
        message.success("Buyer created successfully!");
        form.resetFields();
        setTimeout(() => navigate("/admin/buyer"), 1500);
      } else {
        message.error(data.message || "Failed to create buyer");
      }
    } catch (error) {
      console.error("Error creating buyer:", error);
      message.error("Failed to create buyer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate("/admin/buyer")} className="flex items-center gap-2 text-text-secondary hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Buyers</span>
        </button>
        <h2 className="text-2xl font-bold text-text-primary flex items-center gap-2"><UserPlus className="w-7 h-7" />Add New Buyer</h2>
        <p className="text-text-secondary mt-1">Create new buyer</p>
      </div>

      {/* Form */}
      <div className="bg-surface rounded-xl border border-border p-6 max-w-2xl">
        <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
          {/* Name */}
          <Form.Item label={<span className="text-text-primary font-medium">Full Name</span>} name="name" rules={[{ required: true, message: "Please enter buyer name" }]}>
            <Input prefix={<UserPlus className="w-4 h-4 text-text-secondary" />} placeholder="Enter buyer full name" size="large" />
          </Form.Item>

          {/* Email */}
          <Form.Item label={<span className="text-text-primary font-medium">Email Address</span>} name="email" rules={[{ required: true, message: "Please enter email" }, { type: "email", message: "Please enter valid email"}]}>
            <Input prefix={<Mail className="w-4 h-4 text-text-secondary" />} placeholder="Enter email address" size="large" />
          </Form.Item>

          {/* Password */}
          <Form.Item label={<span className="text-text-primary font-medium">Password</span>} name="password" rules={[{ required: true, message: "Please enter password" }]}>
            <Input.Password prefix={<Lock className="w-4 h-4 text-text-secondary" />} placeholder="Enter password" size="large" />
          </Form.Item>

          {/* Phone */}
          <Form.Item label={<span className="text-text-primary font-medium">Phone Number</span>} name="phone" rules={[{ required: false }]}>
            <Input prefix={<Phone className="w-4 h-4 text-text-secondary" />} placeholder="Enter phone number (optional)" size="large" />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <div className="flex gap-3">
              <Button type="primary" htmlType="submit" loading={loading} size="large" style={{ backgroundColor: "#7b5740", borderColor: "#7b5740"}} className="flex-1">Create Buyer</Button>
              <Button type="default" size="large" onClick={() => navigate("/admin/buyer")} disabled={loading}>Cancel</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
