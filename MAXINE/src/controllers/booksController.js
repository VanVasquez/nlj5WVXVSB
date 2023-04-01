import Book from "../models/book.js";

const booksController = {
  /*
    TODO:   This function is executed when the client sends an HTTP GET
            request to path `/`. This displays `index.hbs` with all
            books currently stored in the database.
    */
  getIndex: function (req, res) {
    // your code here
    Book.find()
      .lean()
      .then((books) => {
        res.render("index", { books }); // This is to load the page initially. You may modify this line to include values / options for the handlebars template.
      })
      .catch(() => {
        res.statusCode = 500; //internal server error
        res.send({ message: "Internal Server Error" });
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
    const ISBN = req.query.isbn;
    Book.findOne({ ISBN })
      .then((isExist) => {
        if (isExist) {
          res.statusCode = 406; //unacceptable
          res.send({ book: isExist });
        } else {
          res.statusCode = 200; //ok
          res.send();
        }
      })
      .catch(() => {
        res.statusCode = 500; //internal server error
        res.send({ message: "Internal Server Error" });
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
      ISBN: req.body.ISBN,
    };
    Book.create(book)
      .then((result) => {
        res.statusCode = 201; //created
        res.send({ book: result });
      })
      .catch(() => {
        res.statusCode = 500; //internal server error
        res.send({ message: "Internal Server Error" });
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
    const ISBN = req.query.isbn;
    Book.findOneAndDelete({ ISBN })
      .then(() => {
        res.statusCode = 200; //ok
        res.send();
      })
      .catch(() => {
        res.statusCode = 500; //internal server error
        res.send({ message: "Internal Server Error" });
      });
  },
};

export default booksController;
