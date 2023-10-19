import { AddComponent } from './add/add.component';
import { BooksEffect } from './store/books.effect';
import { BooksRoutingModule } from './books-routing.module';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit/edit.component';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from '../shared/material/material.module';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { booksReducer } from './store/books.reducer';

@NgModule({
  declarations: [
    HomeComponent,
    AddComponent,
    EditComponent
  ],
  imports: [
    CommonModule,   
    FormsModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    StoreModule.forFeature('mybooks', booksReducer),
    EffectsModule.forFeature([BooksEffect]),
    MaterialModule
  ]
})
export class BooksModule { }
