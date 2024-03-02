import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import errorHandler from "../middlewares/error.js";
import cloudinary from "cloudinary";
import { Books } from "../models/bookModel.js";

export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Books.find({});
  res.status(200).json({
    success: true,
    books,
  });
});

export const postBook = catchAsyncErrors(async (req, res, next) => {
  console.log(req.files);
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new errorHandler("image required! "), 404);
  }

  const { coverImage } = req.files;
  const allowedFormats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(coverImage.mimetype)) {
    return next(
      new errorHandler(
        "Invalid File type please upload your image in a PNG ,JPG OR WEBP FORMAT "
      ),
      400
    );
  }
  // console.log("Fsdas2")
  const cloudinaryResponse = await cloudinary.uploader.upload(
    coverImage.tempFilePath,
    { public_id: "coverImage" }
  );
  // console.log("Fsdas3")

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.log(
      "cloudinary error :",
      cloudinaryResponse.error || "unknow cloudinary error!"
    );
    return next(new errorHandler("Failed to upload image"), 500);
  }
  // console.log("Fsdas4")

  const { title, description, genre, author } = req.body;

  if (!title || !description || !genre || !author) {
    return next(new errorHandler("please provide all the  details", 400));
  }
  // console.log("Fsdas5")
  const book = await Books.create({
    title,
    description,
    genre,
    author,
    coverImage: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // console.log("Fsdas6")
  res.status(200).json({
    success: true,
    message: "Book Added Successfully!",
    book,
  });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let book = await Books.findById(id);
  if (!book) {
    return next(new errorHandler("oops book not found"), 404);
  }

  book = await Books.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    book,
    message: "book updated successfully",
  });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let book = await Books.findById(id);
  if (!book) {
    return next(new errorHandler("oops book not found"), 404);
  }

  await Books.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "book deleted successfully",
  });
});

export const getDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await Books.findById(id);
    if (!book) {
      return next(new errorHandler("book does not exist", 404));
    }
    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    return next(new errorHandler("Invalid Id/Cast Error", 400));
  }
});
