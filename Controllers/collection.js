import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import collection from "../model/collection";

export const createCollection = asyncHandler(async (req, res) => {
  // Take name from frontend
  const { name } = req.body;
  if (!name) {
    throw new CustomError("Collection anme is required", 400);
  }

  const CreateCollection = await collection.create({
    name,
  });

  // send this response value to frontend

  res.status(200).json({
    success: true,
    message: "collection create Success fully",
    CreateCollection,
  });
});

export const Updatecollction = asyncHandler(async (req, res) => {
  // existing value to be updates
  const { id: collectionId } = req.params;
  // new value to get updated
  const { name } = req.body;
  if (!name) {
    throw new CustomError("Collection name is required", 400);
  }

  let updatedCollection = await collection.findByIdAndUpdate(
    collectionId,
    {
      name,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCollection) {
    throw new CustomError("Collection not found", 400);
  }

  //send response to front end
  res.status(200).json({
    success: true,
    message: "Collection Successfully",
    updatedCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const collectionToDelete = await collection.findByIdAndDelete(collectionId);

  if (!collectionToDelete) {
    throw new CustomError("Collection not found", 400);
  }

  collectionToDelete.remove();
  res.status(200).json({
    success: true,
    message: "Collection Deleted from Collections",
  });
});

export const getAllCollection = asyncHandler(async (req, res) => {
  const collections = await collection.find();

  if (!collections) {
    throw new CustomError("No Collecton found", 400);
  }
  res.status(200).json({
    success: true,
    message: "All Collection are Available here",
    collections,
  });
});
