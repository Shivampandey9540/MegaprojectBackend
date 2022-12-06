import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Provide a product Name"],
      trim: true,
      maxLength: [120, "Product Name should be a max of 120 Characters"],
    },
    price: {
      type: Number,
      required: [true, "please provide a product price"],
      maxLength: [5, "Product price should  not be amore than 5 digits"],
    },
    description: {
      type: String,
      /**assignment to add Mark down in Description using Npm packages */
      //   type: Number,
      //   required: [true, "please provide a product price"],
      //   maxLength: [5, "Product price should  not be amore than 5 digits"],
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stack: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },

    collection: {
      /**
       * type: is mongoose.Schema.Types.ObjectId
       *  is because it's storing id
       */
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("product", productSchema);
