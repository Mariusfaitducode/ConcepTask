import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  constructor(private http : HttpClient) { }

  url : string = 'http://localhost:3000/';


  setDatabaseTodos(token : string, todos : Todo[]){


    let headers = { 'Authorization' : 'Bearer ' + token };

    return this.http.post(this.url + 'api/todos/setDatabase', todos, { headers });
  }
}
