import express from "express";
import BorrowerController from "../controllers/BorrowerController";
import { validateRequest } from "../../middlewares/validatorMiddleware";
import {
  addBorrowerValidator,
  borrowBookValidator,
  borrowerIdValidator,
  updateBorrowerValidator,
  returnBookValidator,
} from "../validators/borrowerValidator";

const borrowerController: BorrowerController = new BorrowerController();
const router: express.Router = express.Router();
export default (): express.Router => {
  router
    //Crud operation for Borrower
    .post(
      "/",
      validateRequest(addBorrowerValidator, "body"),
      borrowerController.addBorrower
    )
    .get("/", borrowerController.getBorrowers)
    .delete(
      "/:borrowerId",
      validateRequest(borrowerIdValidator, "params"),
      borrowerController.deleteBorrower
    )
    .put(
      "/:borrowerId",
      validateRequest(borrowerIdValidator, "params"),
      validateRequest(updateBorrowerValidator, "body"),
      borrowerController.updateBorrower
    )
    //route for Borrowing the book
    .post(
      "/:borrowerId/check-in",
      validateRequest(borrowerIdValidator, "params"),
      validateRequest(borrowBookValidator, "body"),
      borrowerController.borrowBook
    )
    //route for returning the book
    .put(
      "/:borrowerId/check-out",
      validateRequest(borrowerIdValidator, "params"),
      validateRequest(returnBookValidator, "body"),
      borrowerController.returnBook
    )
    //route for the books they currently have
    .get(
      "/:borrowerId/book",
      validateRequest(borrowerIdValidator, "params"),
      borrowerController.getBooks
    );
  return router;
};
