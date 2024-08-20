import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  // constructor(private http : HttpClient) { }

  private userSubject = new BehaviorSubject<User | null>(null);

  private userRef: AngularFirestoreDocument<User> | null = null;

  // url : string = 'http://localhost:3000/';


  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {

    // Récupérer l'utilisateur connecté -> AppInit

    this.afAuth.authState.subscribe(user => {
      if (user) {

        this.userRef = this.firestore.doc<User>(`users/${user.uid}`);
        this.userRef.valueChanges().subscribe(userData => {
          this.userSubject.next(userData as User);
        });
      } else {
        this.userSubject.next(null);
      }
    });
  }
  

  // Charger les données utilisateur après connexion ou inscription
  async loadUserData(uid: string): Promise<User | null> {
    this.userRef = this.firestore.doc<User>(`users/${uid}`);
    const userDoc = await this.userRef.get().toPromise();
    const userData = userDoc?.data();
    if (userData) {
      this.userSubject.next(userData);
      return userData;
    }
    return null;
  }

  // Mettre à jour les données utilisateur localement
  setUserData(userData: User): void {
    this.userSubject.next(userData);
  }

  // Nettoyer les données utilisateur lors de la déconnexion
  clearUserData(): void {
    this.userSubject.next(null);
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

  // async postUser(user: User) {

  //   const email = user.email;
  //   const password = user.password;
  //   const displayName = user.pseudo;

  //   const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
  //   await userCredential.user?.updateProfile({ displayName });
  //   return userCredential;
  // }

























  // User Gestion


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
