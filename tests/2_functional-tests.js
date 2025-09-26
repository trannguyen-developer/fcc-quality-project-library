/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        if (res.body[0]) {
          assert.property(
            res.body[0],
            "commentcount",
            "Books in array should contain commentcount"
          );
          assert.property(
            res.body[0],
            "title",
            "Books in array should contain title"
          );
          assert.property(
            res.body[0],
            "_id",
            "Books in array should contain _id"
          );
        }
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    const bookIdInvalid = "68d584815cfe8201b77e4acb";
    const bookIdValid = "68d68ff2d9edb0197516a4d2";

    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          const titleBody = "harry potter";
          chai
            .request(server)
            .post("/api/books")
            .send({ title: titleBody })
            .end(function (err, res) {
              const book = res.body;
              assert.equal(res.status, 200, "status should is 200");
              assert.property(book, "_id", "Book should contain _id");
              assert.property(book, "title", "Book should contain title");
              assert.equal(
                book.title,
                titleBody,
                `Title of book should be '${titleBody}'`
              );
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: titleBody })
            .end(function (err, res) {
              const response = res.body;
              assert.equal(res.status, 200, "status should is 200");
              assert.equal(
                response,
                "missing required field title",
                `response should show text missing`
              );
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an array");
            if (res.body[0]) {
              assert.property(
                res.body[0],
                "commentcount",
                "Books in array should contain commentcount"
              );
              assert.property(
                res.body[0],
                "title",
                "Books in array should contain title"
              );
              assert.property(
                res.body[0],
                "_id",
                "Books in array should contain _id"
              );
            }
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        const bookId = bookIdInvalid;
        chai
          .request(server)
          .get("/api/books/" + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "no book exists",
              "response should show text book not exists"
            );
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        const bookId = bookIdValid;
        chai
          .request(server)
          .get("/api/books/" + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, "_id", "book should contain _id");
            assert.property(res.body, "tile", "book should contain title");
            assert.property(
              res.body,
              "comments",
              "book should contain comments"
            );
            assert.isArray(
              res.body.comments,
              "Comments of book should be an array"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const bookId = bookIdValid;
          const comment = "good";
          chai
            .request(server)
            .post("/api/books/" + bookId)
            .send({ comment })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.property(res.body, "_id", "book should contain _id");
              assert.property(res.body, "tile", "book should contain title");
              assert.property(
                res.body,
                "comments",
                "book should contain comments"
              );
              assert.isArray(
                res.body.comments,
                "Comments of book should be an array"
              );
              assert.include(
                res.body.comments,
                comment,
                `List comment should contain ${comment}`
              );
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          const bookId = bookIdValid;
          chai
            .request(server)
            .post("/api/books/" + bookId)
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.body,
                "missing required field comment",
                "response should show message error"
              );
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          const bookId = bookIdInvalid;
          const comment = "good";
          chai
            .request(server)
            .post("/api/books/" + bookId)
            .send({ comment })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(
                res.body,
                "no book exists",
                "response should show message 'no book exists'"
              );
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        const bookId = bookIdValid;
        chai
          .request(server)
          .delete("/api/books/" + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "delete successful",
              "response should show message 'delete successful'"
            );
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        const bookId = bookIdInvalid;
        chai
          .request(server)
          .delete("/api/books/" + bookId)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(
              res.body,
              "no book exists",
              "response should show message 'no book exists'"
            );
            done();
          });
      });
    });
  });
});
