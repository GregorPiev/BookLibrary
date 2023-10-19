import { createReducer, on } from "@ngrx/store";
import { Books } from "./books";
import { BooksFetchAPISuccess, deleteBookAPISuccess, exit, saveNewBookAPISuccess, updateBookAPISuccess } from "./books.action";
import { state } from "@angular/animations";

export const initialState: ReadonlyArray<Books> = [];

export const booksReducer = createReducer(
  initialState,
  on(BooksFetchAPISuccess,
    (state, { allBooks }) => {
      return allBooks;
    }),
  on(
    saveNewBookAPISuccess,
    (state, { newBook }) => {
      let newState = [...state];
      newState.unshift(newBook);
      return newState;
    }),
  on(updateBookAPISuccess, (state, { updateBook }) => {
    let newState = state.filter((_) => _.id != updateBook.id);
    newState.unshift(updateBook);
    return newState;
  }),
  on(deleteBookAPISuccess,(state,{id})=>{
    let newState = state.filter((_)=>_.id !=id);
    return newState;
  }),
  on(exit, () => initialState)
);
