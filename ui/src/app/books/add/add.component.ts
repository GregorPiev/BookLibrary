import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Appstate } from 'src/app/shared/store/appstate';
import { Books } from '../store/books';
import { Router } from '@angular/router';
import { invokeSaveNewBookApi } from '../store/books.action';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { setAPIStatus } from 'src/app/shared/store/app.action';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, OnDestroy {

  titleConfirm?: string;
  messageConfirm?: string;
  bookForm!: FormGroup;
  upateStatusSubscription!: Subscription;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private router: Router,
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void{
    this.titleConfirm = this.data.title;
    this.messageConfirm = this.data.message;

    this.bookForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required, Validators.minLength(5)]],
      author: ['', [Validators.required, Validators.minLength(5)]],
      cost: [0, [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(25)]]
    });

  }

  save(): void{
    this.store.dispatch(invokeSaveNewBookApi({ newBook: this.bookForm.value }));
    let apiStatus$ = this.appStore.pipe(select(selectAppState));

    this.upateStatusSubscription = apiStatus$.subscribe((apState) => {
      if (apState.apiStatus === 'success') {
        this.appStore.dispatch(
          setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } })
        );
        this.onConfirm();
      }
    });

  };

  onConfirm(): void {
    this.dialogRef.close(true);
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  ngOnDestroy(): void {
    this.upateStatusSubscription.unsubscribe();
  }
}
