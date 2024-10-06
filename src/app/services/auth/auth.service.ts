import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { UserService } from '../user/user.service';

import firebase from 'firebase/compat/app';
import { TaskService } from '../task/task.service';
import { map, Observable } from 'rxjs';
import { Settings } from 'src/app/models/settings';
import { SettingsService } from '../settings/settings.service';
import { ToastController } from '@ionic/angular';
import { AuthentificationResponse } from 'src/app/models/authentification-response';
import { HandleErrors } from 'src/app/utils/handle-errors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private userService: UserService,
    private taskService: TaskService,
    private settingsService: SettingsService,

    private toastController: ToastController
  ) { }


  get isConnected(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }

  // SIGN UP
  // Méthode pour s'inscrire avec email et mot de passe et créer un utilisateur dans Firestore
  async signUp(email: string, password: string, pseudo: string): Promise<AuthentificationResponse> {

    // On utilise try/catch pour gérer les erreurs
    try{
      // Vérifier si le pseudo est unique
      const pseudoExists = await this.checkIfPseudoAlreadyExists(pseudo);

      // Si le pseudo existe déjà, on renvoie une erreur
      if (pseudoExists) {
        throw new Error('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
      }

      // Création de l'utilisateur avec email et mot de passe
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      // Si l'utilisateur est bien créé, on crée le document utilisateur dans Firestore
      if (uid) {
        let userData: User = {
          uid,
          pseudo,
          email,
          settings: this.settingsService.getLocalSettings()
        };

        // On enregistre les données utilisateur dans Firestore
        await this.firestore.collection('users').doc(uid).set(userData);

        // initialise la synchronisation des todos en reprenant les données locales
        this.taskService.initializeTodosFromLocalStorageToFirestore(userData)

        return new AuthentificationResponse(userData, '');
      }
      else{ // Si l'utilisateur n'est pas créé, on renvoie une erreur
        return new AuthentificationResponse(null, "Inscription échouée. Email ou mot de passe incorrect.");;
      }
    } 
    catch (error : any) { // Gestion des erreurs
      console.error("Sign up failed", error);

      // On récupère le bon message en fonction de l'erreur
      let errorMessage = HandleErrors.handleFirebaseErrors(error);

      return new AuthentificationResponse(null, errorMessage);
    }
  }


  // Méthode pour vérifier si le pseudo existe déjà
  private async checkIfPseudoAlreadyExists(pseudo: string): Promise<boolean> {

    const usersRef = this.firestore.collection('users', ref => ref.where('pseudo', '==', pseudo));
    const result = await usersRef.get().toPromise();

    // On renvoie true si le pseudo existe déjà
    return  result != undefined && !result.empty;
  }



  // LOGIN
  // Méthode pour connecter un utilisateur avec email et mot de passe
  async login(email: string, password: string): Promise<AuthentificationResponse> {

    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;
      if (uid) {
        
        // Récupération des données utilisateur
        const userData = await this.userService.loadUserData(uid);

        // Settings synchronisation
        this.settingsService.setUserSettings(userData as User);

        // Todos synchronisation
        this.taskService.setUserId(userData!)

        return new AuthentificationResponse(userData, '');
      }
      else{
        return new AuthentificationResponse(null, "No user id, login failed");
      }
    } 
    catch (error) { // Gestion des erreurs
      let errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new AuthentificationResponse(null, errorMessage);
    }
  }


  // Connexion avec Google
  async loginWithGoogle(): Promise<AuthentificationResponse> {
    try {

      // Appel de la méthode de connexion Google avec popup
      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      const uid = userCredential.user?.uid;

      if (uid) {
        const userData = await this.userService.loadUserData(uid);
        
        // CONNEXION
        // Si l'utilisateur existe déjà dans Firestore on le récupère 
        if (userData) { 

          // Settings synchronisation
          this.settingsService.setUserSettings(userData as User);
          // Todos synchronisation
          this.taskService.setUserId(userData)

          return new AuthentificationResponse(userData, ''); // L'utilisateur existe déjà dans Firestore
        } 
        // INSCRIPTION
        // Si l'utilisateur n'existe pas dans Firestore, on le crée avec les informations de google 
        else if (userCredential.user) { 

          const userData = await this.setUserDataOnSignUpWithExternalInformations(userCredential.user);
          return new AuthentificationResponse(userData, '');
        }
      }
      return new AuthentificationResponse(null, "No user id, google login failed");
    } 
    catch (error) { // Gestion des erreurs
      const errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new AuthentificationResponse(null, errorMessage);
    }
  }


  // Connexion avec GitHub
  async loginWithGitHub(): Promise<AuthentificationResponse> {
    try {

      // Appel de la méthode de connexion GitHub avec popup
      const provider = new firebase.auth.GithubAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      const uid = userCredential.user?.uid;

      if (uid) {

        const userData = await this.userService.loadUserData(uid);
        
        // CONNEXION
        // Si l'utilisateur existe déjà dans Firestore on le récupère 
        if (userData) {

          // Settings synchronisation
          this.settingsService.setUserSettings(userData as User);
          // Todos synchronisation
          this.taskService.setUserId(userData)

          return new AuthentificationResponse(userData, ''); // L'utilisateur existe déjà dans Firestore
        } 
        // INSCRIPTION  
        // Si l'utilisateur n'existe pas dans Firestore, on le crée avec les informations de GitHub
        else if (userCredential.user) { // Sign in

          const userData = await this.setUserDataOnSignUpWithExternalInformations(userCredential.user);
          return new AuthentificationResponse(userData, '');
        }
      }
      console.error();
      return new AuthentificationResponse(null, "No user id, github login failed");
    } 
    catch (error) { // Gestion des erreurs
      const errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new AuthentificationResponse(null, errorMessage);
    }
  }


  // Inscription avec les informations de connexion externes (Google, GitHub)
  async setUserDataOnSignUpWithExternalInformations(user: firebase.User): Promise<User> {

    const uid = user.uid;

    let userData: User = {
      uid: user.uid || '',
      email: user.email || '',
      pseudo: user.displayName || '',
      avatar: user.photoURL || '',
      settings: this.settingsService.getLocalSettings()
    };

    // Enregistrement des données utilisateur
    await this.firestore.collection('users').doc(uid).set(userData);

    console.log('USER DATA from external informations : ', userData)

    // Todos synchronisation
    this.taskService.initializeTodosFromLocalStorageToFirestore(userData)

    return userData;
  }


  // DECONNEXION
  // Méthode pour déconnecter l'utilisateur
  async logout(): Promise<void> {

    // Déconnexion de l'utilisateur
    await this.afAuth.signOut();

    // Nettoyer les données locales des todos
    this.taskService.clearLocalStorageOnLogout();

    // this.userService.clearUserData();
  }
}
