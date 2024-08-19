import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject, tap } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  // constructor(private http : HttpClient) { }

  private userSubject = new BehaviorSubject<User | null>(null);

  // url : string = 'http://localhost:3000/';


  constructor(private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        // Mettez à jour le sujet utilisateur avec les informations de Firebase
        const userData : User = {
          uid: user.uid,
          _id: 0, // You might want to generate this or get it from somewhere else
          firstname: user.displayName?.split(' ')[0] || '',
          lastname: user.displayName?.split(' ')[1] || '',
          pseudo: user.displayName || '',
          email: user.email || '',
          password: '', // For security reasons, don't store the password here
          status: 'active', // You can set a default status
          phone: user.phoneNumber || '',
          avatar: user.photoURL || '',
          todos: [] // Initialize with an empty array
        };
        this.userSubject.next(userData as User);
      } else {
        this.userSubject.next(null);
      }
    });
  }
  


  getUserWithToken() {
    return this.userSubject.asObservable();
  }

  getUser() {
    return this.userSubject.asObservable();
  }

  
  // postUser(user : User){
  //   // return this.http.post(this.url + 'api/users', user);
  // }

  async postUser(user: User) {

    const email = user.email;
    const password = user.password;
    const displayName = user.pseudo;

    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    await userCredential.user?.updateProfile({ displayName });
    return userCredential;
  }




  updateUser(user : User){
    let token = localStorage.getItem('token');
    let headers = { 'Authorization' : 'Bearer ' + token };

    // return this.http.put(this.url + 'api/users', user, { headers }).pipe(tap({
    //   next: res => { 
    //     console.log('Update user:', res); 
    //     this.userSubject.next(res as User);
    //   },
    //   error: err => { console.error('Error:', err); }
    // }));
  
  }


  setUser(token : string){
    localStorage.setItem('user', token);
  }

  // getUserWithToken(){
    
  //   let token = localStorage.getItem('token');
  //   let headers = { 'Authorization' : 'Bearer ' + token };

  //   return this.http.get(this.url + 'api/users/test', { headers }).pipe(tap({
  //     next: res => { 
  //       console.log('Response:', res); 
  //       this.userSubject.next(res as User);
  //     },
  //     error: err => { console.error('Error:', err); }
  //   }));
  // }

  // getUser(){
  //   // let user = JSON.parse(localStorage.getItem('user') || 'null');
    
  //   return this.userSubject.asObservable()
  // }
}
