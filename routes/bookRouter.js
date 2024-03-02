import express from "express";
import {
  deleteBook,
  getAllBooks,
  getDetails,
  postBook,
  updateBook,
} from "../controllers/bookController.js";
const router = express.Router();

router.post("/post", postBook);
router.get("/getall", getAllBooks);
router.delete("/delete/:id", deleteBook);
router.put("/update/:id", updateBook);
router.get("/:id", getDetails);

export default router;
