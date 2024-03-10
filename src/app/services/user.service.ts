import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http : HttpClient) { }

  private userSubject = new BehaviorSubject<User | null>(null);

  url : string = 'http://localhost:3000/';

  postUser(user : User){
    return this.http.post(this.url + 'api/users', user);
  }

  getUserWithToken(){
    
    let token = localStorage.getItem('token');
    let headers = { 'Authorization' : 'Bearer ' + token };

    return this.http.get(this.url + 'api/users/test', { headers }).pipe(tap({
      next: res => { 
        console.log('Response:', res); 
        this.userSubject.next(res as User);
      },
      error: err => { console.error('Error:', err); }
    }));
  }


  updateUser(user : User){
    let token = localStorage.getItem('token');
    let headers = { 'Authorization' : 'Bearer ' + token };

    return this.http.put(this.url + 'api/users', user, { headers }).pipe(tap({
      next: res => { 
        console.log('Response:', res); 
        this.userSubject.next(res as User);
      },
      error: err => { console.error('Error:', err); }
    }));
  
  }


  setUser(token : string){
    localStorage.setItem('user', token);
  }

  getUser(){
    // let user = JSON.parse(localStorage.getItem('user') || 'null');
    
    return this.userSubject.asObservable()
  }
}
