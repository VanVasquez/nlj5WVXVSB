import Book from "../models/book.js";
const booksController = {
  /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `index.hbs` with all
            books currently stored in the database.
    */
  getIndex: function (req, res) {
    Book.find()
      .select("title author isbn")
      .lean()
      .then((results) => {
        res.render("index", { books: results });
      });
  },

  /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/getISBN`. This function checks if a
            specific ISBN is stored in the database. If the number
            is stored in the database, it returns an object with the
            ISBN, otherwise, it returns an empty string.
    */
  getCheckISBN: function (req, res) {
    // your code here
    const { isbn } = req.query;
    console.log(isbn);
    Book.findOne({ isbn: isbn })
      .then((book) => {
        if (!book) {
          res.status(200).json({});
        }
        if (book) {
          res
            .status(409)
            .json({ message: `ISBN: ${book.isbn} is already in database` });
        }
      })
      .catch((error) => {
        res.status(500).json({ message: "An error occured", error: error });
      });
  },

  /*
    TODO:   This function is executed when the client sends an HTTP POST
            request to path `/book`. This function adds the book
            sent by the client to the database, then appends the new
            book to the list of books, as displayed in `index.hbs`.
    */
  postBook: function (req, res) {
    // your code here
    const book = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.ISBN,
    };
    Book.create(book)
      .then(() => {
        //Created
        res.status(201).json({ book });
      })
      .catch((error) => {
        console.log(error);
        //duplicate entry
        if (error.code === 11000) {
          res
            .status(409)
            .json({ message: `ISBN: ${error.keyValue.isbn} is existing` });
        } else {
          res.status(500).json({ message: "Internal server error" });
        }
      });
  },

  /*
    TODO:   This function is executed when the client sends an HTTP DELETE
            request to path `/book`. This function deletes the book
            from the database, then removes the book from the list of
            books, as displayed in `index.hbs`.
    */
  deleteBook: function (req, res) {
    // your code here
    const { isbn } = req.query;
    Book.findOneAndDelete({ isbn: isbn })
      .then(() => {
        res.status(200).json({});
      })
      .catch((error) => {
        res.status(500).json({ message: "An error occured", error: error });
      });
  },
};

export default booksController;
