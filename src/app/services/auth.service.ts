import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }

  url : string = 'http://localhost:3000/';




    // Méthode pour s'inscrire
    async signUp(email: string, password: string, pseudo: string, firstname: string, lastname: string): Promise<void> {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
  
      if (uid) {
        const userData: User = {
          uid,
          pseudo,
          email,
          firstname,
          lastname,
          todos: []
        };
  
        await this.firestore.collection('users').doc(uid).set(userData);
        this.userService.setUserData(userData);
      }
    }
  
  
    // Méthode pour connecter un utilisateur avec email et mot de passe
    async login(email: string, password: string): Promise<User | null> {
      try {
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        const uid = userCredential.user?.uid;
        if (uid) {
          return await this.userService.loadUserData(uid);
        }
        return null;
      } 
      catch (error) {
        console.error("Login failed", error);
        return null;
      }
    }
  
    // Méthode pour déconnecter l'utilisateur
    async logout(): Promise<void> {
      await this.afAuth.signOut();
      this.userService.clearUserData();
    }
  


  // TODO : afficher authentification problems


  // signUp(user : User){
  //   // return this.http.post(this.url + 'api/users', user);

  //   return this.http.post<User>(this.url + 'api/auth/signup', user);
    
  //   // .pipe(tap({
  //   //   next: res => { console.log('Response:', res); },
  //   //   error: err => { console.error('Error:', err); }
  //   // }));
  // }

  // logIn(user : User){

  //   return this.http.post<User>(this.url + 'api/auth/login', user);
    
  //   // .pipe(tap({
  //   //   next: res => { console.log('Response:', res); },
  //   //   error: err => { console.error('Error:', err); }
  //   // }));
  // }
  



  // TODO : réflechir à une gestion générique des erreurs

  // private handleError(error: HttpErrorResponse) {
  //   if (error.status === 409) {
  //     // Conflict exception
  //     alert('Cette adresse email est déjà utilisée.'); // Utilisez plutôt un service de notification ou un mécanisme similaire
  //   } else {
  //     // Autres types d'erreurs
  //     console.error('An error occurred:', error.error);
  //   }
  //   return throwError('Something bad happened; please try again later.');
  // }
}
