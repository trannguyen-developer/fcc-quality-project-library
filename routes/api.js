/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../schema/book");
const Comment = require("../schema/comment");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      const books = await Book.find({});
      res.json(books);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        let title = req.body.title;
        const book = new Book({ bookName: title });
        await book.save();
        res.json({ message: "create book successfully" });
        //response will contain new book object including atleast _id and title
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        await Comment.deleteMany({});
        res.json("complete delete successful");
        //if successful response will be 'complete delete successful'
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) {
        return res.json({ error: "missing bookid" });
      }

      const book = Book.findById(bookid);

      if (book) {
        res.json(book);
      } else {
        res.json({ message: "not found bookId" });
      }

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      const commentBook = new Comment({ book: bookid, content: comment });
      await commentBook.save();
      const book = await Book.findById(bookid);

      res.json(book);
      //json res format same as .get
    })

    .delete(async function (req, res) {
      try {
        let bookid = req.params.id;
        await Book.findByIdAndDelete(bookid);

        res.json("delete successful");

        //if successful response will be 'delete successful'
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    });
};
