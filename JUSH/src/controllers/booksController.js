/**
 ** Status 200 =  OK
 ** Status 201 =  Created
 ** Status 202 =  Accepted
 ** Status 406 =  Not Acceptable
 ** Status 500 =  Internal Server Error
 */
import Book from "../models/book.js";

const booksController = {
  getIndex: async function (req, res) {
    try {
      const books = await Book.find().lean();
      res.render("index", { books });
    } catch (err) {
      res.status(500).json({ error: err, message: "Internal Server Error" });
    }
  },

  getCheckISBN: async function (req, res) {
    try {
      const { isbn: ISBN } = req.query;
      const book = await Book.findOne({ ISBN });
      if (book) {
        res.status(406).json({ isbn: book.ISBN });
      } else {
        res.status(202).json({});
      }
    } catch (err) {
      res.status(500).json({ error: err, message: "Internal Server Error" });
    }
  },

  postBook: async function (req, res) {
    try {
      const { title, author, ISBN } = req.body;
      const newBook = await Book.create({ title, author, ISBN });
      res.status(201).json({ book: newBook });
    } catch (err) {
      res.status(500).json({ error: err, message: "Internal Server Error" });
    }
  },

  deleteBook: async function (req, res) {
    try {
      const { isbn: ISBN } = req.query;
      await Book.findOneAndDelete({ ISBN });
      res.status(200).json();
    } catch (err) {
      res.status(500).json({ error: err, message: "Internal Server Error" });
    }
  },
};

export default booksController;
