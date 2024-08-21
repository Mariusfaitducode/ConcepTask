import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserService } from '../user/user.service';

import firebase from 'firebase/compat/app';
import { SyncService } from '../sync.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private userService: UserService,
    private syncService: SyncService
  ) { }


  // Méthode pour s'inscrire
  async signUp(email: string, password: string, pseudo: string, firstname: string, lastname: string): Promise<User | null> {
    const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = userCredential.user?.uid;

    if (uid) {
      let userData: User = {
        uid,
        pseudo,
        email,
        firstname,
        lastname,
        todos: []
      };

      

      // Créé le user dans firestore
      await this.firestore.collection('users').doc(uid).set(userData);

      // Todos synchronisation
      this.syncService.accountGetLocalTodos(userData);


      return userData;
    }
    else{
      return null;
    }
  }


  // Méthode pour connecter un utilisateur avec email et mot de passe
  async login(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
      if (uid) {
        
        let userData = await this.userService.loadUserData(uid);

        // Todos synchronisation
        if (userData){
          this.syncService.localGetAccountTodos(userData);
        }

        return userData;
      }
      console.error("No user id, login failed");
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
        const userData = await this.userService.loadUserData(uid);
        
        if (userData) {
          this.syncService.localGetAccountTodos(userData);
          return userData; // L'utilisateur existe déjà dans Firestore
        } 
        else if (userCredential.user) { // Sign in

          return this.setUserDataWithFromFirebaseUser(userCredential.user);
        }
      }
      console.error("No user id, google login failed");
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

        const userData = await this.userService.loadUserData(uid);
        
        if (userData) {
          this.syncService.localGetAccountTodos(userData);
          return userData; // L'utilisateur existe déjà dans Firestore
        } 
        else if (userCredential.user) { // Sign in

          return this.setUserDataWithFromFirebaseUser(userCredential.user);
        }
      }
      console.error("No user id, github login failed");
      return null;
    } catch (error) {
      console.error("GitHub login failed", error);
      return null;
    }
  }


  // Sign in with Firebase user
  async setUserDataWithFromFirebaseUser(user: firebase.User): Promise<User> {

    const uid = user.uid;

    let userData: User = {
      uid: user.uid || '',
      email: user.email || '',
      pseudo: user.displayName || '',
      avatar: user.photoURL || '',
      todos: []
    };

    await this.firestore.collection('users').doc(uid).set(userData);

    console.log('USER DATA : ', userData)

    await this.syncService.accountGetLocalTodos(userData);

    return userData;
  }


  // Méthode pour déconnecter l'utilisateur
  async logout(): Promise<void> {
    await this.afAuth.signOut();

    this.syncService.clearLocalTodos();

    // this.userService.clearUserData();
  }
}
