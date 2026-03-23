import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoicePDF = async (invoice, order, buyer, seller, mobile) => {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({ margin: 50 });

      // Generate filename
      const filename = `invoice-${invoice.invoiceNumber}.pdf`;
      const filepath = path.join(__dirname, "../../uploads/invoices", filename);

      // Ensure directory exists
      const dir = path.dirname(filepath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Pipe to file
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Header
      doc.fontSize(24).text("INVOICE", { align: "center" });
      doc.moveDown();

      // Invoice details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${invoice.invoiceNumber}`, { align: "right" });
      doc.text(`Order Number: ${order.orderNumber}`, { align: "right" });
      doc.text(`Date: ${new Date(invoice.generatedAt).toLocaleDateString()}`, { align: "right" });
      doc.moveDown(2);

      // Buyer information
      doc.fontSize(12).text("Bill To:", { underline: true });
      doc.fontSize(10);
      doc.text(`Name: ${buyer.name}`);
      doc.text(`Email: ${buyer.email}`);
      doc.moveDown();

      // Seller information
      doc.fontSize(12).text("Seller:", { underline: true });
      doc.fontSize(10);
      doc.text(`Name: ${seller.name}`);
      doc.text(`Email: ${seller.email}`);
      if (seller.phone) {
        doc.text(`Phone: ${seller.phone}`);
      }
      doc.moveDown(2);

      // Product details
      doc.fontSize(12).text("Product Details:", { underline: true });
      doc.fontSize(10);
      doc.text(`Brand: ${mobile.brand}`);
      doc.text(`Model: ${mobile.model}`);
      doc.text(`RAM: ${mobile.ram}GB`);
      doc.text(`Storage: ${mobile.storage}GB`);
      doc.text(`Condition: ${mobile.condition}`);
      doc.moveDown(2);

      // Payment details
      doc.fontSize(12).text("Payment Information:", { underline: true });
      doc.fontSize(10);
      doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`);
      doc.text(`Payment Status: ${order.paymentStatus.toUpperCase()}`);
      doc.moveDown(2);

      // Price section
      doc.fontSize(14).text("Amount Details:", { underline: true });
      doc.moveDown(0.5);
      
      // Price line
      doc.fontSize(12);
      const priceY = doc.y;
      doc.text(`Price:`, 50, priceY);
      doc.text(`Rs. ${order.price.toLocaleString()}`, 400, priceY, { align: "right" });
      
      doc.moveDown();
      
      // Total line (bold)
      const totalY = doc.y;
      doc.fontSize(14).font("Helvetica-Bold");
      doc.text(`Total Amount:`, 50, totalY);
      doc.text(`Rs. ${order.price.toLocaleString()}`, 400, totalY, { align: "right" });
      
      doc.font("Helvetica");
      doc.moveDown(3);

      // Footer
      doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });
      doc.fontSize(8).text("This is a computer-generated invoice.", { align: "center" });

      // Finalize PDF
      doc.end();

      stream.on("finish", () => {
        resolve(`/uploads/invoices/${filename}`);
      });

      stream.on("error", (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
};
