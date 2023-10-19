import { createAction, props } from "@ngrx/store";
import { Books } from './books';

export const invokeBooksAPI = createAction(
  '[Books API] Invoke Books Fetch API'
);

export const BooksFetchAPISuccess = createAction(
  '[Books API] Fetch API Success',
  props<{ allBooks: Books[] }>()
);

export const invokeSaveNewBookApi = createAction(
  '[Book API] Invoke save new book api',
  props<{ newBook: Books }>()
)

export const saveNewBookAPISuccess = createAction(
  '[Book API] save new book api success',
  props<{ newBook: Books }>()
);

export const invokeUpdateBookAPI = createAction(
  '[Book API] Invoke update book api',
  props<{ updateBook: Books }>()
);

export const updateBookAPISuccess = createAction(
  '[Book API] update book api success',
  props<{updateBook: Books}>()
);

export const invokeDeleteBookAPI = createAction(
  '[Book API] Invoke delete book api',
  props<{id: number}>()
);

export const deleteBookAPISuccess = createAction(
  '[Book API] delete book api success',
  props<{id: number}>()
);

export const exit = createAction(
  "[Book API] down till initial values"
)

