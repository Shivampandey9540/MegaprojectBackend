import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
});

export default mongoose.model("product", productSchema);
