import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Books } from './store/books';
import { Observable } from 'rxjs';

const BASE_URL = "http://localhost:3000/books"

@Injectable({
  providedIn: 'root'
})
export class BooksService {


  constructor(private http: HttpClient) { }

  get(): Observable<Books[]>{
    return this.http.get<Books[]>(BASE_URL);
  }
  create(payload: Books): Observable<Books>{
    return this.http.post<Books>(BASE_URL, payload);
  }

  update(payload: Books): Observable<Books> {
    return this.http.put<Books>(`${BASE_URL}/${payload.id}`, payload);
  }

  delete(id: number): Observable<number>{
    return this.http.delete<number>(`${BASE_URL}/${id}`);
  }
}
