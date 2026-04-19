import express from "express";
import { 
  createOrder, 
  getOrderById, 
  getBuyerOrders, 
  getSellerOrders, 
  updateOrderStatus, 
  uploadPaymentProof, 
  confirmPayment 
} from "../../controller/order/order.controller.js";
import { 
  generateInvoice, 
  getInvoice, 
  downloadInvoice 
} from "../../controller/invoice/invoice.controller.js";
import { auth, isAdmin, requirePhoneVerified } from "../../middleware/auth.js";
import { uploadPaymentProof as multerUpload } from "../../config/multer.js";

const router = express.Router();

// Order routes
router.post("/", auth, requirePhoneVerified, createOrder);
router.get("/buyer/my-orders", auth, getBuyerOrders);
router.get("/seller/my-orders", auth, getSellerOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id/status", auth, requirePhoneVerified, updateOrderStatus);
router.post("/:id/payment-proof", auth, requirePhoneVerified, multerUpload.single("paymentProof"), uploadPaymentProof);
router.put("/:id/confirm-payment", auth, requirePhoneVerified, confirmPayment);

// Invoice routes
router.post("/:orderId/invoice", auth, requirePhoneVerified, generateInvoice);
router.get("/:orderId/invoice", auth, getInvoice);
router.get("/:orderId/invoice/download", auth, downloadInvoice);

export default router;
