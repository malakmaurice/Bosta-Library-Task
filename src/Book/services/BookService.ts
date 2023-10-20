import { Book, BookSearch } from "Book/model/book";
import express from "express";
import moment from "moment";
const knex = require("../../db/db");
export class BookService {
  //private connection;
  constructor() {
    ////this.connection = knex.getConnection();
  }
  addBook = async (book: Book) => {
    try {
      const [id] = await knex("book")
        .insert({ ...book })
        .returning("id");
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getBooks = async (bookSearch: BookSearch) => {
    try {
      const query = knex("book").select("*");
      if (bookSearch.title) query.andWhere("title", "=", bookSearch.title);
      if (bookSearch.author) query.andWhere("author", "=", bookSearch.author);
      if (bookSearch.ISBN) query.andWhere("ISBN", "=", bookSearch.ISBN);
      return await query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  getBookById = async (bookId: string) => {
    try {
      const query = knex("book").select("*").where("id", "=", bookId);

      return await query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  deleteBook = async (bookId: string) => {
    try {
      return await knex("book").del("*").where("id", "=", bookId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  updateBook = async (bookId: string, book: Book) => {
    try {
      return await knex("book")
        .update({ ...book })
        .where("id", "=", bookId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  overdueBooks = async () => {
    try {
      const query = knex("track")
        .select("book.*", "track.expected_check_out", "track.id as trackId")
        .innerJoin("book", "book.id", "track.book_id")
        .where("is_returned", "=", false)
        .andWhere("expected_check_out", "<", moment.utc());
      return await query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  overdueBooksLastMonth = async () => {
    try {
      const firstDayInLastMonth = moment()
        .utc()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const lastDayInLastMonth = moment()
        .utc()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");

      const query = await knex("track")
        .select("book.*", "track.expected_check_out", "track.id as trackId")
        .innerJoin("book", "book.id", "track.book_id")
        .where("is_returned", "=", false)
        .andWhere("expected_check_out", "<", moment.utc())
        .whereBetween("expected_check_out", [
          firstDayInLastMonth,
          lastDayInLastMonth,
        ]);

      return query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  borrowBooksLastMonth = async () => {
    try {
      const firstDayInLastMonth = moment()
        .utc()
        .subtract(1, "months")
        .startOf("month")
        .format("YYYY-MM-DD");
      const lastDayInLastMonth = moment()
        .utc()
        .subtract(1, "months")
        .endOf("month")
        .format("YYYY-MM-DD");

      const query = await knex("track")
        .select("book.*", "track.expected_check_out", "track.id as trackId")
        .innerJoin("book", "book.id", "track.book_id")
        .whereBetween("check_in", [firstDayInLastMonth, lastDayInLastMonth]);

      return query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  isBookExist = async (bookId: string) => {
    try {
      const query = await knex("book").select("id").where("id", "=", bookId);
      return query.length > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  isBookAvailable = async (bookId: string) => {
    try {
      const result = await knex.transaction((trx: any) => {
        knex("book")
          .transacting(trx)
          .select("available_quantity")
          .from("book")
          .where("id", "=", bookId)
          .then(trx.commit)
          .catch(trx.rollback);
      });
      return result[0]?.available_quantity > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
