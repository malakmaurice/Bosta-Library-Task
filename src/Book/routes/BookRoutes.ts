import express from "express";
import BookController from "../controllers/BookController";
import {
  addBookValidator,
  bookIdValidator,
  getBookValidator,
  updateBookValidator,
} from "../validators/bookValidator";
import { validateRequest } from "../../middlewares/validatorMiddleware";

const bookController: BookController = new BookController();
const router: express.Router = express.Router();
export default (): express.Router => {
  router
    .post(
      "/",
      validateRequest(addBookValidator, "body"),
      bookController.addBook
    )
    .get(
      "/",
      validateRequest(getBookValidator, "query"),
      bookController.getBooks
    )
    .delete(
      "/:bookId",
      validateRequest(bookIdValidator, "params"),
      bookController.deleteBook
    )
    .put(
      "/:bookId",
      validateRequest(bookIdValidator, "params"),
      validateRequest(updateBookValidator, "body"),
      bookController.updateBook
    )
    //list books that are overdue.
    .get("/overdue", bookController.overdueBooks)
    //list the  books that are overdue las month.
    .get("/overdue/last-month", bookController.overdueBooksLastMonth)
     //list the  books that are been borrowed las month.
     .get("/borrowed/last-month", bookController.borrowBooksLastMonth);
  return router;
};
