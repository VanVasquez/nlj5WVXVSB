import { Schema, model, SchemaTypes } from "mongoose";

/*
    TODO:   Complete the bookSchema which will contain the title, author, and ISBN of a book in the database.
*/
const bookSchema = new Schema({
  // your code here
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
});

const Book = model("book", bookSchema);

export default Book;
