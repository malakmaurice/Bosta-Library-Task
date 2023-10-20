export interface Book {
  id?: string;
  title?: string;
  author?: string;
  quantity?: Number;
  available_quantity?: Number;
  location?: string;
  ISBN?: Number;
}

export interface BookSearch {
  title?: string;
  author?: string;
  ISBN?: Number;
}
