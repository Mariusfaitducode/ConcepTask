import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http : HttpClient) { }

  url : string = 'http://localhost:3000/';

  postUser(user : User){
    return this.http.post(this.url + 'api/users', user);
  }

  getUser(){
    return this.http.get(this.url + 'users');
  }
}
