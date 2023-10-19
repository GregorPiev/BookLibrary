import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Appstate } from 'src/app/shared/store/appstate';
import { Books } from '../store/books';
import { invokeUpdateBookAPI } from '../store/books.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { selectBookById } from '../store/books.selector';
import { setAPIStatus } from '../../shared/store/app.action';
import { Subscribable, Subscription, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {

  bookForm!: FormGroup;
  dataSubscription!: Subscription;
  upateDataSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appStore: Store<Appstate>,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {

    this.bookForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(5)]],
      author: ['', [Validators.required, Validators.minLength(5)]],
      cost: [0, [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(25)]]
    });


    let fetchData$ = this.route.paramMap.pipe(
      switchMap((param) => {
        const id = Number(param.get('id'));
        return this.store.pipe(select(selectBookById(id)));
      })
    );

    this.dataSubscription = fetchData$.subscribe((data: Books | null) => {
      if (data) {        
        this.bookForm.setValue(data);
      }
      else {
        this.router.navigate(['/books']);
      }
    })
  }

  update() {    
    this.store.dispatch(
      invokeUpdateBookAPI({ updateBook: { ...this.bookForm.value } })
    );

    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    this.upateDataSubscription = apiStatus$.subscribe((apState) => {
      if (apState.apiStatus == 'success') {
        this.appStore.dispatch(
          setAPIStatus({
            apiStatus: { apiResponseMessage: '', apiStatus: '' }
          })
        );
        this.router.navigate(['/books']);
      }
    });


  }

  scrollTo(el: Element): void {
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  scrollToError(): void {
    const firstElementWithError = document.querySelector('.ng-invalid[formControlName]');
    if (firstElementWithError) {
      this.scrollTo(firstElementWithError);
    }
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
    this.upateDataSubscription.unsubscribe();
  }
}
