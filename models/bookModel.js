import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide book title"],
      minLength: [3, "book title must contain 3 characters"],
      maxLength: [20, "book title cannot exceed more than 50 character"],
    },
    description: {
      type: String,
      requred: [true, "please provide book Description"],
      minLength: [100, "book description must contain at least 50 characters"],
      maxLength: [
        1000,
        "book description cannot exceed more than 350 character",
      ],
    },
    genre: {
      type: String,
      requred: [true, "job category is requred"],
    },
    author: {
      type: String,
      required: [true, "please provide Author name"],
    },
    coverImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Books = mongoose.model("Books", bookSchema);
