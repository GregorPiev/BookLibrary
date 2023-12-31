import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, select } from "@ngrx/store";
import { EMPTY, map, mergeMap, switchMap, withLatestFrom } from "rxjs";
import { invokeBooksAPI, BooksFetchAPISuccess, invokeSaveNewBookApi, saveNewBookAPISuccess, invokeUpdateBookAPI, updateBookAPISuccess, invokeDeleteBookAPI, deleteBookAPISuccess } from "./books.action";
import { selectBooks } from "./books.selector";
import { BooksService } from "../books.service";
import { Appstate } from "src/app/shared/store/appstate";
import { setAPIStatus } from "src/app/shared/store/app.action";


@Injectable()
export class BooksEffect {

  constructor(
    private actions$: Actions,
    private store: Store,
    private booksService: BooksService,
    private appStore: Store<Appstate>
  ) { }

  loadAllBooks$ = createEffect(
    () => this.actions$.pipe(
      ofType(invokeBooksAPI),
      withLatestFrom(this.store.pipe(select(selectBooks))),
      mergeMap(([, bookformStore]) => {
        if (bookformStore.length > 0) {
          return EMPTY;
        }
        return this.booksService
          .get()
          .pipe(map((data) => BooksFetchAPISuccess({ allBooks: data })))
      })
    )
  );

  saveNewBook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeSaveNewBookApi),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );

        return this.booksService.create(action.newBook).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' },
              })
            );
            return saveNewBookAPISuccess({ newBook: data });
          })
        );

      })
    );
  });

  updateBookAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(invokeUpdateBookAPI),
      switchMap((action) => {
        this.appStore.dispatch(
          setAPIStatus({
            apiStatus: { apiResponseMessage: '', apiStatus: '' }
          })
        );

        return this.booksService.update(action.updateBook).pipe(
          map((data) => {
            this.appStore.dispatch(
              setAPIStatus({
                apiStatus: { apiResponseMessage: '', apiStatus: 'success' }
              })
            );
            return updateBookAPISuccess({ updateBook: data });
          })
        )
      })
    )
  });

  deleteBookAPI$ =createEffect(()=>{
    return this.actions$.pipe(
      ofType(invokeDeleteBookAPI),
      switchMap((actions) =>{
        this.appStore.dispatch(
          setAPIStatus({
            apiStatus:({apiResponseMessage: '', apiStatus: ''})
          })
        );
        return this.booksService.delete(actions.id).pipe(
          map(() => {
              this.appStore.dispatch(
                setAPIStatus({
                  apiStatus: ({apiResponseMessage: '', apiStatus: 'success'})
                })
              );
              return deleteBookAPISuccess({id: actions.id});
          })
        )

      })
    )
  });
}
