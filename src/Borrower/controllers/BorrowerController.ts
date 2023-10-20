import { BookService } from "../../Book/services/BookService";
import { BorrowBook } from "../model/borrowBook";
import { Borrower } from "../model/borrower";
import { BorrowerService } from "../services/BorrowerService";
import express from "express";
import { v4 as uuidv4 } from "uuid";
export default class BorrowerController {
  private borrowerService: BorrowerService;
  private bookService: BookService;
  constructor() {
    this.borrowerService = new BorrowerService();
    this.bookService = new BookService();
  }
  addBorrower = async (req: express.Request, res: express.Response) => {
    try {
      const { name, email } = req.body;
      const borrower: Borrower = {
        id: uuidv4(),
        name,
        email,
      };

      const payload = await this.borrowerService.addBorrower(borrower);
      res.status(201).send({
        payload,
        message: "New Borrower Added",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  getBorrowers = async (req: express.Request, res: express.Response) => {
    try {
      const payload = await this.borrowerService.getBorrowers();
      res.status(200).send({
        payload,
        message: "All Borrowers retrieved successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  deleteBorrower = async (req: express.Request, res: express.Response) => {
    try {
      const borrowerId = req.params.borrowerId;

      const payload = await this.borrowerService.deleteBorrower(borrowerId);

      if (payload.length == 0) {
        return res.status(404).send({
          message: "this is id not exist",
        });
      }
      res.status(200).send({
        message: "the Borrower deleted successfully",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  updateBorrower = async (req: express.Request, res: express.Response) => {
    try {
      const borrowerId = req.params.borrowerId;
      const { name, email } = req.body;
      const borrower: Borrower = {
        name,
        email,
      };
      const payload = await this.borrowerService.updateBorrower(
        borrowerId,
        borrower
      );
      if (payload == 0) {
        return res.status(404).send({
          message: "this is id not exist",
        });
      }
      res.status(200).send({
        payload,
        message: "the Borrower updated successfully",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  borrowBook = async (req: express.Request, res: express.Response) => {
    try {
      const borrowerId = req.params.borrowerId;
      const isBorrowerExist = await this.borrowerService.isBorrowerExist(
        borrowerId
      );

      if (!isBorrowerExist)
        return res.status(404).send({
          message: "this borrower id doesn't exist",
        });

      const { book_id, expected_check_out } = req.body;

      const isBookAvailable = await this.bookService.isBookAvailable(book_id);
      if (!isBookAvailable)
        return res.status(404).send({
          message: "this book  isn't available ",
        });
      const borrowBook: BorrowBook = {
        book_id,
        borrower_id: borrowerId,
        expected_check_out,
      };

      const payload = await this.borrowerService.borrowBook(borrowBook);
      res.status(201).send({
        trackId: payload.id,
        message: "A Borrower took the book successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: "something went wrong",
      });
    }
  };
  returnBook = async (req: express.Request, res: express.Response) => {
    try {
      const borrowerId = req.params.borrowerId;
      const { trackId, bookId } = req.body;
      const isBookExist = await this.bookService.isBookExist(bookId);
      if (!isBookExist)
        return res.status(404).send({
          message: "this book  does't exist ",
        });
      const isTrackExist = await this.borrowerService.isTrackExist(trackId);

      if (!isTrackExist) {
        return res.status(404).send({
          message: "this is track id not exist",
        });
      }
      const payload = await this.borrowerService.returnBook(bookId, trackId);
      res.status(200).send({
        payload,
        message: "the Book returned successfully",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  getBooks = async (req: express.Request, res: express.Response) => {
    try {
      const borrowerId = req.params.borrowerId;
      const payload = await this.borrowerService.getBooks(borrowerId);

      res.status(200).send({
        payload,
        message: "All Books retrieved successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };
}
