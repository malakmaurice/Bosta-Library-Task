import { BorrowBook } from "../model/borrowBook";
import { Borrower } from "../model/borrower";
import * as moment from "moment";
import express from "express";
//import knex from "../../db/db";
const knex = require("../../db/db");

export class BorrowerService {
  constructor() {}
  addBorrower = async (borrower: Borrower) => {
    try {
      const [id] = await knex("borrower")
        .insert({ ...borrower })
        .returning("id");
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getBorrowers = async () => {
    try {
      const query = knex("borrower").select("*");

      return await query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteBorrower = async (borrowerId: string) => {
    try {
      return await knex("borrower").del("*").where("id", "=", borrowerId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  updateBorrower = async (borrowerId: string, borrower: Borrower) => {
    try {
      return await knex("borrower")
        .update({ ...borrower })
        .where("id", "=", borrowerId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  borrowBook = async (borrowBook: BorrowBook) => {
    try {
      const [id] = await knex.transaction((trx: any) => {
        knex("book")
          .transacting(trx)
          .decrement({ available_quantity: 1 })
          .from("book")
          .where("id", "=", borrowBook.book_id)
          .then(() => {
            return knex("track")
              .transacting(trx)
              .insert({ ...borrowBook })
              .returning("id");
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  returnBook = async (bookId: string, trackId: string) => {
    try {
      return await knex.transaction((trx: any) => {
        knex("track")
          .transacting(trx)
          .update({ is_returned: true, check_out: moment.utc() })
          .where("id", "=", trackId)
          .then(() => {
            return knex("book")
              .transacting(trx)
              .increment({ available_quantity: 1 })
              .from("book")
              .where("id", "=", bookId);
          })
          .then(trx.commit)
          .catch(trx.rollback);
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  getBooks = async (borrowerId: string) => {
    try {
      const query = knex("track")
        .select(
          "book.*",
          "track.id as track_id",
          "track.expected_check_out",
          "track.check_in"
        )
        .innerJoin("book", "book.id", "track.book_id")
        .where("borrower_id", "=", borrowerId)
        .andWhere("is_returned", "=", false);

      return await query;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  isBorrowerExist = async (borrowerId: string) => {
    try {
      const query = await knex("borrower")
        .select("id")
        .where("id", "=", borrowerId);
      return query.length > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  isTrackExist = async (trackId: string) => {
    try {
      const query = await knex("track").select("id").where("id", "=", trackId);
      return query.length > 0;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
