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
import { Platform, ToastController } from '@ionic/angular';
import { AuthentificationResponse, RequestResponse } from 'src/app/models/firebase-response';
import { HandleErrors } from 'src/app/utils/handle-errors';
import { EmailAuthProvider } from 'firebase/auth';

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

    private platform: Platform,

    private toastController: ToastController
  ) { }


  get isConnected(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => !!user)
    );
  }


  // * SIGN UP
  // Méthode pour s'inscrire avec email et mot de passe et créer un utilisateur dans Firestore
  async signUp(email: string, password: string, pseudo: string): Promise<AuthentificationResponse> {

    // On utilise try/catch pour gérer les erreurs
    try{
      // // Vérifier si le pseudo est unique
      // const pseudoExists = await this.userService.checkIfPseudoAlreadyExists(pseudo);

      // // Si le pseudo existe déjà, on renvoie une erreur
      // if (pseudoExists) {
      //   throw new Error('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
      // }

      // Création de l'utilisateur avec email et mot de passe
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user?.uid;

      // Si l'utilisateur est bien créé, on crée le document utilisateur dans Firestore
      if (uid) {

        // TODO : use userService to create the user on firestore
        let userData: User = {
          uid,
          pseudo,
          email,
          settings: this.settingsService.getLocalSettings(),
          todosTracker: [],
          teams: []
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


  



  // * LOGIN
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

      provider.setCustomParameters({
        'prompt': 'select_account'
      });


      // const userCredential = this.platform.is('mobile') ? 
      //   await this.afAuth.signInWithRedirect(provider) :
      //   await this.afAuth.signInWithPopup(provider);

      // this.afAuth.getRedirectResult().then((result) => {
      //   console.log('Google redirect result:', result);

      //   if (result.user) {
      //     // User successfully authenticated
      //     console.log('Redirect result:', result);
      //   }
      // }).catch((error) => {
      //   console.error('Authentication redirect error:', error);
      // });

      await this.afAuth.signInWithRedirect(provider);

       // Listen for the redirect result after authentication
      
      const userCredential = await firebase.auth().getRedirectResult(); 

      console.log('userCredential = ', userCredential)

      return new AuthentificationResponse(null, 'test');

      // if (!userCredential) {
      //   return new AuthentificationResponse(null, "No user credential, google login failed");
      // }

      
      // const uid = userCredential.user?.uid;

      // if (uid) {
      //   const userData = await this.userService.loadUserData(uid);
        
      //   // * CONNEXION
      //   // Si l'utilisateur existe déjà dans Firestore on le récupère 
      //   if (userData) { 

      //     // Settings synchronisation
      //     this.settingsService.setUserSettings(userData as User);
      //     // Todos synchronisation
      //     this.taskService.setUserId(userData)

      //     return new AuthentificationResponse(userData, ''); // L'utilisateur existe déjà dans Firestore
      //   } 
      //   // * INSCRIPTION
      //   // Si l'utilisateur n'existe pas dans Firestore, on le crée avec les informations de google 
      //   else if (userCredential.user) { 

      //     const userData = await this.setUserDataOnSignUpWithExternalInformations(userCredential.user);
      //     return new AuthentificationResponse(userData, '');
      //   }
      // }
      // return new AuthentificationResponse(null, "No user id, google login failed");
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


      provider.setCustomParameters({
        'prompt': 'select_account'
      });

      // const userCredential = this.platform.is('mobile') ? 
      //   await this.afAuth.signInWithRedirect(provider) :
      //   await this.afAuth.signInWithPopup(provider);

      // this.afAuth.getRedirectResult().then((result) => {
      //   console.log('github redirect result', result)
      //   if (result.user) {
      //     // User successfully authenticated
      //     console.log('Redirect result GITHUB :', result);
      //   }
      // }).catch((error) => {
      //   console.error('Authentication redirect error:', error);
      // });

      console.log('github redirect')

      await this.afAuth.signInWithRedirect(provider);

      console.log('github redirect 2')

      const userCredential = await firebase.auth().getRedirectResult(); 

      console.log('userCredential = ', userCredential)


      return new AuthentificationResponse(null, 'test');

      // if (!userCredential) {
      //   return new AuthentificationResponse(null, "No user credential, github login failed");
      // }


      // const uid = userCredential.user?.uid;

      // if (uid) {

      //   const userData = await this.userService.loadUserData(uid);
        
      //   // CONNEXION
      //   // Si l'utilisateur existe déjà dans Firestore on le récupère 
      //   if (userData) {

      //     // Settings synchronisation
      //     this.settingsService.setUserSettings(userData as User);
      //     // Todos synchronisation
      //     this.taskService.setUserId(userData)

      //     return new AuthentificationResponse(userData, ''); // L'utilisateur existe déjà dans Firestore
      //   } 
      //   // INSCRIPTION  
      //   // Si l'utilisateur n'existe pas dans Firestore, on le crée avec les informations de GitHub
      //   else if (userCredential.user) { // Sign in

      //     const userData = await this.setUserDataOnSignUpWithExternalInformations(userCredential.user);
      //     return new AuthentificationResponse(userData, '');
      //   }
      // }
      // console.error();
      // return new AuthentificationResponse(null, "No user id, github login failed");
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
      settings: this.settingsService.getLocalSettings(),
      todosTracker: [],
      teams: []
    };

    // Enregistrement des données utilisateur
    await this.firestore.collection('users').doc(uid).set(userData);

    console.log('USER DATA from external informations : ', userData)

    // Todos synchronisation
    this.taskService.initializeTodosFromLocalStorageToFirestore(userData)

    return userData;
  }


  // * DECONNEXION
  // Méthode pour déconnecter l'utilisateur
  async logout(): Promise<void> {

    // Déconnexion de l'utilisateur
    await this.afAuth.signOut();

    // Nettoyer les données locales des todos
    this.taskService.clearLocalStorageOnLogout();

    // this.userService.clearUserData();
  }


  // * UPDATE EMAIL OR PASSWORD


  // Méthode pour mettre à jour l'email de l'utilisateur
  async updateUserEmail(newEmail: string): Promise<AuthentificationResponse> {
    try {
      const user = await this.afAuth.currentUser;
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }

      console.log('newEmail = ', newEmail)
      console.log('user.email = ', user.email)

      // Ré-authentifier l'utilisateur avant la mise à jour
      const credential = EmailAuthProvider.credential(user.email!, prompt('Veuillez entrer votre mot de passe') || '');
      await user.reauthenticateWithCredential(credential);

      // Mettre à jour l'email dans Firebase Authentication
      await user.updateEmail(newEmail);

      // Mettre à jour l'email dans Firestore
      const uid = user.uid;
      await this.firestore.collection('users').doc(uid).update({ email: newEmail });

      // Récupérer les données utilisateur mises à jour
      const updatedUserData = await this.userService.loadUserData(uid);

      return new AuthentificationResponse(updatedUserData, 'Email mis à jour avec succès');
    } catch (error) {
      console.error("Échec de la mise à jour de l'email", error);
      const errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new AuthentificationResponse(null, errorMessage);
    }
  }


  async updateUserPassword(newPassword: string): Promise<AuthentificationResponse> {
    try {
      const user = await this.afAuth.currentUser;

      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }

      // Ré-authentifier l'utilisateur avant la mise à jour
      const credential = EmailAuthProvider.credential(user.email!, prompt('Veuillez entrer votre mot de passe') || '');
      await user.reauthenticateWithCredential(credential);

      // Mettre à jour l'email dans Firebase Authentication
      await user.updatePassword(newPassword);

      // Récupérer les données utilisateur mises à jour
      const updatedUserData = await this.userService.loadUserData(user.uid);

      return new AuthentificationResponse(updatedUserData, 'Password mis à jour avec succès');

    }
    catch (error) {
      console.error("Échec de la mise à jour du mot de passe", error);
      const errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new AuthentificationResponse(null, errorMessage);
    }
  }



  async deleteUserAccount(): Promise<RequestResponse> {
   
    try{
      const user = await this.afAuth.currentUser;
      if (!user) {
        throw new Error('Aucun utilisateur connecté');
      }

      await user.delete();

      return new RequestResponse(true, 'Compte supprimé avec succès');
    }
    catch(error){
      const errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new RequestResponse(false, errorMessage);
    }
  }

}
