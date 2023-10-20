export interface BorrowBook {
  id?: string;
  book_id?: string;
  borrower_id?: string;
  expected_check_out?: Date;
  check_out?: Date;
  is_returned?: Boolean;
}
