import Invoice from "../../models/Invoice.js";
import Order from "../../models/Order.js";
import User from "../../models/User.js";
import Mobile from "../../models/Mobile.js";
import { generateInvoicePDF } from "../../utils/invoiceGenerator.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate invoice for an order
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    console.log('Generating invoice for order:', orderId);
    console.log('User ID:', userId);

    // Get order with populated data
    const order = await Order.findById(orderId)
      .populate("buyerId")
      .populate("sellerId")
      .populate("mobileId");

    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: "Order not found" });
    }

    console.log('Order found:', order._id);

    // Check if user is buyer or seller
    if (order.buyerId._id.toString() !== userId && order.sellerId._id.toString() !== userId) {
      console.log('Access denied - user is not buyer or seller');
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if invoice already exists
    let invoice = await Invoice.findOne({ orderId });
    
    if (!invoice) {
      console.log('Creating new invoice...');
      // Create new invoice
      invoice = await Invoice.create({
        invoiceNumber: "", // Will be auto-generated
        orderId: order._id,
        buyerId: order.buyerId._id,
        sellerId: order.sellerId._id,
        mobileId: order.mobileId._id,
        amount: order.price
      });
      console.log('Invoice created:', invoice._id, 'Invoice number:', invoice.invoiceNumber);
    } else {
      console.log('Invoice already exists:', invoice._id);
    }

    // Generate PDF if not already generated
    if (!invoice.pdfUrl) {
      console.log('Generating PDF...');
      const pdfUrl = await generateInvoicePDF(
        invoice,
        order,
        order.buyerId,
        order.sellerId,
        order.mobileId
      );
      
      console.log('PDF generated at:', pdfUrl);
      invoice.pdfUrl = pdfUrl;
      await invoice.save();
      console.log('Invoice saved with PDF URL');
    } else {
      console.log('PDF already exists at:', invoice.pdfUrl);
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get invoice by order ID
export const getInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is buyer or seller
    if (order.buyerId.toString() !== userId && order.sellerId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const invoice = await Invoice.findOne({ orderId })
      .populate("orderId")
      .populate("buyerId", "name email")
      .populate("sellerId", "name email phone")
      .populate("mobileId");

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found. Generate invoice first." });
    }

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Download invoice PDF
export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    console.log('Downloading invoice for order:', orderId);

    const order = await Order.findById(orderId);
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is buyer or seller
    if (order.buyerId.toString() !== userId && order.sellerId.toString() !== userId) {
      console.log('Access denied');
      return res.status(403).json({ message: "Access denied" });
    }

    const invoice = await Invoice.findOne({ orderId });
    if (!invoice || !invoice.pdfUrl) {
      console.log('Invoice or PDF not found');
      return res.status(404).json({ message: "Invoice PDF not found" });
    }

    console.log('Invoice PDF URL:', invoice.pdfUrl);
    
    // Remove leading slash if present and construct absolute path from project root
    const pdfPath = invoice.pdfUrl.startsWith('/') ? invoice.pdfUrl.substring(1) : invoice.pdfUrl;
    const filepath = path.join(process.cwd(), pdfPath);
    
    console.log('Looking for PDF at:', filepath);
    
    res.download(filepath, `invoice-${invoice.invoiceNumber}.pdf`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: error.message });
  }
};
