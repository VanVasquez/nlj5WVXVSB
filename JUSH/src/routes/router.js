import { Router } from "express";
import booksController from "../controllers/booksController.js";

const router = Router();

router.get("/", booksController.getIndex);
router.get("/checkISBN", booksController.getCheckISBN);
router.post("/books", booksController.postBook);
router.delete("/delete", booksController.deleteBook);

export default router;