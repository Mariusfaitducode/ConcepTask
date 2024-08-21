import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserService } from '../user/user.service';

import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private userService: UserService
  ) { }


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
      // this.userService.setUserData(userData);
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


  // Connexion avec Google
  async loginWithGoogle(): Promise<User | null> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      const uid = userCredential.user?.uid;

      if (uid) {
        const existingUser = await this.userService.loadUserData(uid);
        
        if (existingUser) {
          return existingUser; // L'utilisateur existe déjà dans Firestore
        } 
        else if (userCredential.user) {
          return this.setUserDataWithFromFirebaseUser(userCredential.user);
        }
      }
      return null;
    } 
    catch (error) {
      console.error("Google login failed", error);
      return null;
    }
  }


  // Connexion avec GitHub
  async loginWithGitHub(): Promise<User | null> {
    try {
      const provider = new firebase.auth.GithubAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      const uid = userCredential.user?.uid;

      if (uid) {

        const existingUser = await this.userService.loadUserData(uid);
        
        if (existingUser) {
          return existingUser; // L'utilisateur existe déjà dans Firestore
        } 
        else if (userCredential.user) {
          return this.setUserDataWithFromFirebaseUser(userCredential.user);
        }
      }
      return null;
    } catch (error) {
      console.error("GitHub login failed", error);
      return null;
    }
  }

  

  async setUserDataWithFromFirebaseUser(user: firebase.User): Promise<User> {

    const uid = user.uid;

    const newUser: User = {
      uid: user.uid || '',
      email: user.email || '',
      pseudo: user.displayName || '',
      avatar: user.photoURL || '',
      todos: []
    };

    await this.firestore.collection('users').doc(uid).set(newUser);
    // this.userService.setUserData(newUser);

    return newUser;
  }




  // Méthode pour déconnecter l'utilisateur
  async logout(): Promise<void> {
    await this.afAuth.signOut();
    // this.userService.clearUserData();
  }

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
