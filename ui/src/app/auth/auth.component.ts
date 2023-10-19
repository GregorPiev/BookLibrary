import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { selectError, selectToken } from './store/auth.selector';

import { Appstate } from '../shared/store/appstate';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { User } from './store/auth';
import { login } from '../auth/store/auth.action';
import { selectAppState } from '../shared/store/app.selector';
import { setAPIStatus } from '../shared/store/app.action';

@Component({
  selector: 'app-login',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  username: string | null = null;
  password: string | null = null;
  error = { display: false, message: 'Username or password invalid' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private appStore: Store<Appstate>
  ) { }

  ngOnInit(): void {}

  onLogin() {
    if ((!this.username || this.username.length < 3) || (!this.password || this.password.length < 3)) {
      this.errorMessageHandler();
      return;
    } else {
      this.authService.login(this.username, this.password).subscribe((result: User[] | string) => {
        console.log('result:', result);
        const username = this.username as unknown as string;
        const password = this.password as unknown as string;
        this.store.dispatch(login({ username, password }));

        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((apState) => {
          if (apState.apiStatus == 'success') {

            this.appStore.dispatch(
              setAPIStatus({ apiStatus: ({ apiResponseMessage: '', apiStatus: '' }) })
            );
            this.router.navigate(['/books']);
          }else if(apState.apiStatus === 'false'){
            this.errorMessageHandler();
          }
        });

      });
    }
  }

  errorMessageHandler() {
    this.error.display = true;
    let errorHandler = setTimeout(() => {
      this.error.display = false;
      clearTimeout(errorHandler);
    }, 3000);

  }

}
