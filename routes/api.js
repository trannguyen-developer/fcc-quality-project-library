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

      const result = books.map((book) => ({
        _id: book._id,
        title: book?.bookName,
        commentcount: book?.comments?.length,
      }));

      res.json(result);
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      try {
        let title = req.body.title;
        if (!title) {
          return res.json("missing required field title");
        }

        const book = new Book({ bookName: title });
        await book.save();

        res.json({ _id: book._id, title: book.bookName });
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
        return res.json("complete delete successful");
        //if successful response will be 'complete delete successful'
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      try {
        let bookid = req.params.id;
        // if (!bookid) {
        //   return res.json({ error: "missing bookid" });
        // }

        const book = await Book.findById(bookid).populate("comments");

        console.log("book", book);

        if (!book) {
          return res.json("no book exists");
        }

        const result = {
          _id: book._id,
          title: book.bookName,
          comments: book.comments.map((comment) => comment.content),
        };

        return res.json(result);

        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .post(async function (req, res) {
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;

        if (!comment) {
          return res.json("missing required field comment");
        }

        const commentBook = new Comment({ book: bookid, content: comment });
        await commentBook.save();

        await Book.findByIdAndUpdate(bookid, {
          $push: { comments: commentBook._id },
        });

        const book = await Book.findById(bookid).populate("comments");

        if (!book) {
          return res.json("no book exists");
        }

        const result = {
          _id: book._id,
          title: book.bookName,
          comments: book.comments.map((comment) => comment.content),
        };

        res.json(result);
        //json res format same as .get
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    })

    .delete(async function (req, res) {
      try {
        let bookid = req.params.id;
        const book = await Book.findByIdAndDelete(bookid);

        if (!book) {
          return res.json("no book exists");
        }

        res.json("delete successful");

        //if successful response will be 'delete successful'
      } catch (error) {
        console.log("error", error);
        res.json({ error });
      }
    });
};
