import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber:  { type: String, unique: true },
    orderId:        { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    buyerId:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sellerId:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    mobileId:       { type: mongoose.Schema.Types.ObjectId, ref: "Mobile", required: true },
    amount:         { type: Number, required: true },
    pdfUrl:         { type: String },
    generatedAt:    { type: Date, default: Date.now }
  }, { timestamps: true }
);

// Generate invoice number before saving
invoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `INV-${Date.now()}-${count + 1}`;
  }
  next();
});

export default mongoose.model("Invoice", invoiceSchema);
