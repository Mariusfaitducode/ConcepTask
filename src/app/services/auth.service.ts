import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

  url : string = 'http://localhost:3000/';


  // TODO : afficher authentification problems


  signUp(user : User){
    // return this.http.post(this.url + 'api/users', user);

    return this.http.post<User>(this.url + 'api/auth/signup', user).pipe(tap({
      next: res => { console.log('Response:', res); },
      error: err => { console.error('Error:', err); }
    }));
  }

  logIn(user : User){

    return this.http.post<User>(this.url + 'api/auth/login', user).pipe(tap({
      next: res => { console.log('Response:', res); },
      error: err => { console.error('Error:', err); }
    }));
  }


  setToken(token : string){
    localStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
