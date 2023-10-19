import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { logout, refreshApp } from 'src/app/auth/store/auth.action';
import { selectUser } from 'src/app/auth/store/auth.selector';
import { Appstate } from '../../shared/store/appstate';
import { exit } from '../../books/store/books.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public user!: string;

  constructor(
    private store: Store,
    private router: Router,
    private appStore: Store<Appstate>,
  ) { }

  ngOnInit(): void {
    this.checkUser();
  }

  logout(): void{
    this.store.dispatch(logout());
    this.store.dispatch(exit());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    this.user = '';
    this.router.navigate(['/']);
  }

  checkUser() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    this.store.pipe(select(selectUser))
      .subscribe((userStore: string) => {
        if (userStore !== "") {
          this.user = userStore;
        } else if (user && token) {          
          this.store.dispatch(refreshApp({ token, user }))
        } else {
          this.user = '';
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          this.router.navigate(['/']);
        }
    })
  }

}
