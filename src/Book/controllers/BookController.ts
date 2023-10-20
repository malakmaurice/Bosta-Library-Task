import { Book, BookSearch } from "../model/book";
import { BookService } from "../services/BookService";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
export default class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }
  addBook = async (req: express.Request, res: express.Response) => {
    try {
      const { title, author, quantity, location, ISBN } = req.body;
      const book: Book = {
        id: uuidv4(),
        title,
        author,
        available_quantity: quantity,
        quantity,
        location,
        ISBN,
      };

      const payload = await this.bookService.addBook(book);
      res.status(201).send({
        payload,
        message: "New Book Added",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  getBooks = async (req: express.Request, res: express.Response) => {
    try {
      const { title, author, ISBN } = req.query;

      const bookSearch: BookSearch = {
        title: title as string,
        author: author as string,
        ISBN: Number(ISBN),
      };

      const payload = await this.bookService.getBooks(bookSearch);
      res.status(200).send({
        payload,
        message: "All Book retrieved successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  deleteBook = async (req: express.Request, res: express.Response) => {
    try {
      const bookId = req.params.bookId;

      const payload = await this.bookService.deleteBook(bookId);

      if (payload.length == 0) {
        return res.status(404).send({
          message: "this is id not exist",
        });
      }
      res.status(200).send({
        message: "the Book deleted successfully",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  updateBook = async (req: express.Request, res: express.Response) => {
    try {
      const bookId = req.params.bookId;
      const { title, author, quantity, location, ISBN } = req.body;
      let updatedBook: Book = {
        title,
        author,
        quantity,
        location,
        ISBN,
      };
      if (updatedBook.quantity != undefined) {
        const available_quantity = await this.updateAvailableQuantity(
          bookId,
          updatedBook.quantity
        );
        if (available_quantity < 0) {
          return res.status(400).send({
            message: "this quantity must be greater than that",
          });
        }
        updatedBook = { ...updatedBook, available_quantity };
      }

      const payload = await this.bookService.updateBook(bookId, updatedBook);
      if (payload == 0) {
        return res.status(400).send({
          message: "this is id not exist",
        });
      }
      res.status(200).send({
        payload,
        message: "the Book updated successfully",
      });
    } catch (error) {
      res.status(400).send({
        message: "something went wrong",
      });
    }
  };
  updateAvailableQuantity = async (bookId: string, updatedQuantity: Number) => {
    const book = await this.bookService.getBookById(bookId);
    let { quantity, available_quantity } = book[0];
    let diff_quantity: number;
    if (quantity > updatedQuantity) {
      diff_quantity = quantity - (updatedQuantity as number);
      available_quantity -= diff_quantity;
    } else {
      diff_quantity = (updatedQuantity as number) - quantity;
      available_quantity += diff_quantity;
    }
    return available_quantity;
  };
  overdueBooks = async (req: express.Request, res: express.Response) => {
    try {
      const payload = await this.bookService.overdueBooks();
      res.status(200).send({
        payload,
        message: "All overdue Books retrieved successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: "something went wrong",
      });
    }
  };

  overdueBooksLastMonth = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const payload = await this.bookService.overdueBooksLastMonth();
      res.status(200).send({
        payload,
        message: "All overdue Books last month retrieved successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: "something went wrong",
      });
    }
  };
  borrowBooksLastMonth = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const payload = await this.bookService.borrowBooksLastMonth();
      res.status(200).send({
        payload,
        message: "All borrowed Books last month retrieved successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(400).send({
        message: "something went wrong",
      });
    }
  };
}
