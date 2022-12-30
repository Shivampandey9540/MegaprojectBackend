import collection from "../model/collection";
import asyncHandler from "../services/asyncHandler";
import CustomError from "../utils/customError";
import mongoose from "mongoose";
/************************************************
 *  @POST Adding Collection
 *  @route https://localhost:4000/api/auth/AddNewCollection
 *  @description This route will be used to Add new collection
 *  @parametes  - Name  @req.body
 *  @return
 *************************************************/

const CollectionCreated = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError("please fill the fields", 400);
  }

  const CollectionExist = await collection.findOne({ name });
  if (CollectionExist) {
    throw new CustomError("Collection Already Exist", 400);
  }
  const NewCol = await collection.create({
    name,
  });

  console.log(user);

  res.status(200).json({
    success: true,
    NewCol,
  });
});

/************************************************
 *  @GET All collection Avilable
 *  @route https://localhost:4000/api/auth/GetAllCollectionList
 *  @description This route will provide us, All the collection which are avilable
 *  @parametes
 *  @return Object's
 *************************************************/
const getAllCollectionlist = asyncHandler(async (_req, res) => {
  const allCollection = await collection.find();

  res.status(200).json({
    success: true,
    Message: " All the collection are available here",
    collection: allCollection,
  });
});

/************************************************
 *  @Get Specific Collection
 *  @route https://localhost:4000/api/auth/SpecCollection/:_id
 *  @description This route will provide us, Collection Based on _id in params
 *  @parametes _id
 *  @return Object's
 *************************************************/
const getSpecCollection = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new CustomError("Please Provide the Id toGet data", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new CustomError("Given Id is not a ObjectId of Mongoose ", 400);
  }

  const data = await collection.findById({ _id: _id });
  if (!data) {
    throw new CustomError("No, Data is associated with this Id", 404);
  }
  res.status(200).json({
    success: true,
    message: "Data has been found",
    Data: data,
  });
});
const UpdateCollectionName = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new CustomError("Please Provide the Id to Change Data", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new CustomError("Given Id is not a ObjectId of Mongoose ", 400);
  }

  const data = await collection.findById({ _id: _id });
  if (!data) {
    throw new CustomError("No, Data is associated with this Id", 404);
  }
  const { changeName } = req.body;
  if (!changeName) {
    throw new CustomError("No, Data sent to change ", 401);
  }

  data.name = changeName;
  data.save();
  res.status(200).json({
    success: true,
    message: "Collection Name is changed",
    Data: data,
  });
});

/************************************************
 *  @Delete  Delete Collection
 *  @route https://localhost:4000/api/auth/DeleteCollection/:_id
 *  @description This route will be used to update the existing
 *  collectionName
 *  @parametes _id
 *  @return User Object
 *************************************************/
const deleteSpecCollection = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new CustomError(
      "Please Provide the Id Delete the collection data",
      400
    );
  }
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    throw new CustomError("Given Id is not a ObjectId of Mongoose ", 400);
  }
  const data = await collection.deleteOne({ _id: _id });

  res.status(200).json({
    success: true,
    message: "Data has been found",
    Data: data,
  });
});

module.exports = {
  CollectionCreated,
  getAllCollectionlist,
  getSpecCollection,
  UpdateCollectionName,
  deleteSpecCollection,
};
