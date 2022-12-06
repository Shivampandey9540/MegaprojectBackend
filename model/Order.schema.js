import mongoose from "mongoose";

const orderScheam = mongoose.Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
          },
          count: Number,
          price: Number,
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },

    Address: {
      type: String,
      required: true,
    },

    Amount: {
      type: Number,
      required: true,
    },
    coupon: String,

    transactionId: String,
    status: {
      type: String,
      enum: ["ORDERD", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "ORDERD",
      //CAN WE IMPROVE THIS ?
    },
    //PAYMENTMODE: UPI, creditcard or wallet, COD
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("order", orderScheam);
