import { Observable, map, of, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './store/auth';

const BASE_URL = "http://localhost:3000";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<string> {
    return this.http.get<string>(`${BASE_URL}/users?username=${username}&password=${password}`)

      .pipe(
        map(
          (user) => {
            if(user.length){
              let temp = user[0] as unknown as User;
              const userLocal = JSON.stringify({ 'id': temp['id'], 'name': temp['name'] });
              localStorage.setItem('user', temp['name']);
              localStorage.setItem('token', '123456');
            }
            return (user.length && '123456' || '') as string;
          }
        )
      );
  }

}
