import { Schema, model, SchemaTypes } from "mongoose";

/*
    TODO:   Complete the bookSchema which will contain the title, author, and ISBN of a book in the database.
*/
const bookSchema = new Schema({
  // your code here
  title: { type: SchemaTypes.String, required: true },
  author: { type: SchemaTypes.String, required: true },
  ISBN: { type: SchemaTypes.String, required: true, unique: true },
});

const Book = model("book", bookSchema);

export default Book;
