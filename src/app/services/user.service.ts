import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { tap } from 'rxjs';

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
    
    let token = localStorage.getItem('token');
    let headers = { 'Authorization' : 'Bearer ' + token };

    return this.http.get(this.url + 'api/users/test', { headers }).pipe(tap({
      next: res => { console.log('Response:', res); },
      error: err => { console.error('Error:', err); }
    }));
  }
}
