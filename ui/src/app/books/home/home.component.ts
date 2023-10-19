import { Component, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { invokeBooksAPI, invokeDeleteBookAPI } from '../store/books.action';

import { AddComponent } from '../add/add.component';
import { Appstate } from '../../shared/store/appstate';
import { Books } from '../store/books';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { selectAppState } from 'src/app/shared/store/app.selector';
import { selectBooks } from '../store/books.selector';
import { setAPIStatus } from 'src/app/shared/store/app.action';

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books$!: Observable<Books[]>;
  deleteModal: any;
  idToDelete: number = 0;  

  expandedElement: any = null;
  element: any = null;

  displayedColumns: string[] = ['toggle','id', 'name', 'author', 'cost', 'actions'];
  displayedColumns2: string[] = ['description'];
  dataSource!: MatTableDataSource<Books>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store,
    private appStore: Store<Appstate>,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.store.dispatch(invokeBooksAPI());

    setTimeout(() => {
      // this.books$ = this.store.pipe(select(selectBooks));

      this.store.pipe(select(selectBooks)).subscribe((books)=>{      
        if(books.length){
          this.dataSource = new MatTableDataSource<Books>(books);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    }, 3000);
  }  

  addNewBook() {
    const dialogRef = this.dialog.open(AddComponent, {
      data: { title: 'Adding New Book Dialog', message: 'Are you sure you want to proceed?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        // this.store.dispatch(invokeDeleteCarAPI({ id }));

        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((apState) => {
          if (apState.apiStatus == 'success') {
            this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } }))
          }
        })


      } else {
        console.log('Adding cancelled.');
      }
    })
  }

  openDeleteModal(id: number):void{
    this.idToDelete = id;
    $('#deleteModal').modal('show');
  }

  close():void{
    $('#deleteModal').modal('hide');
  }

  delete(): void {
    this.store.dispatch(invokeDeleteBookAPI({ id: this.idToDelete }));
    let apiStatus$ = this.appStore.pipe(select(selectAppState));
    apiStatus$.subscribe((apState) => {
      if(apState.apiStatus =='success'){
        $('#deleteModal').modal('hide');
        this.appStore.dispatch(
          setAPIStatus({apiStatus:({apiResponseMessage: '', apiStatus: ''})})
        );
      }
    });
  }
}
