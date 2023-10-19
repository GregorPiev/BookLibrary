import { createFeatureSelector, createSelector, select } from '@ngrx/store';
import { Books } from "./books";

export const selectBooks = createFeatureSelector<Books[]>('mybooks');

export const selectBookById = (bookId: number) =>
  createSelector(selectBooks, (books: Books[]) => {
    var bookById = books.filter((_) => _.id == bookId);
    if (bookById.length == 0) {
      return null;
    }
    return bookById[0];
});
