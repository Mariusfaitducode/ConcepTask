import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  // constructor(private http : HttpClient) { }

  private userSubject = new BehaviorSubject<User | null>(null);

  private userRef: AngularFirestoreDocument<User> | null = null;

  private userSubscription: Subscription | null = null;


  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {

    // Subscribe to the authState observable to get the current user at beginning, connect or disconnect
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.setUserSubscription(user.uid);
      } else {
        this.clearUserSubscription();
      }
    });
  }


  private setUserSubscription(uid: string): void {
    // Nettoyer l'abonnement précédent s'il existe
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }

    console.log('User service : setUserSubscription')
    this.userRef = this.firestore.doc<User>(`users/${uid}`);

    this.userSubscription = this.userRef.valueChanges().subscribe(userData => {
      // console.log('UserRef subscription : userData = ', userData)
      this.userSubject.next(userData as User);
    });
  }


  private clearUserSubscription(): void {
    // Désabonner et nettoyer l'utilisateur lorsque déconnecté

    console.log('User service : clearUserSubscription')

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }
    this.userSubject.next(null);
  }
  


  getUser() {
    return this.userSubject.asObservable();
  }
  

  // Charger les données utilisateur après connexion ou inscription
  async loadUserData(uid: string): Promise<User | null> {

    console.log('User service : loadUserData')

    this.userRef = this.firestore.doc<User>(`users/${uid}`);
    const userDoc = await this.userRef.get().toPromise();
    const userData = userDoc?.data();
    if (userData) {
      // this.userSubject.next(userData);
      return userData;
    }
    return null;
  }


  // Méthode pour mettre à jour l'utilisateur dans Firestore, y compris la photo de profil
  async updateUser(user: User, profilePictureFile: File | null): Promise<boolean> {
    try {
      if (this.userRef) {
        if (profilePictureFile) {
          const filePath = `profile_pictures/${user.uid}`;
          const fileRef = this.storage.ref(filePath);
          const uploadTask = this.storage.upload(filePath, profilePictureFile);

          await uploadTask.snapshotChanges().pipe(
            finalize(async () => {
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              user.avatar = downloadURL;
              await this.userRef!.update(user);
              this.userSubject.next(user); // Mettre à jour l'utilisateur localement
            })
          ).toPromise();
        } else {
          await this.userRef.update(user);
          this.userSubject.next(user); // Mettre à jour l'utilisateur localement
        }
        return true; // Mise à jour réussie
      }
      return false; // UserRef n'existe pas
    } catch (error) {
      console.error('Error updating user:', error);
      return false; // Une erreur s'est produite
    }
  }


  // Mettre à jour les données utilisateur localement
  // setUserData(userData: User): void {
  //   this.userSubject.next(userData);
  //   console.log('User service :Setting user data:', userData);

  // }


  // Nettoyer les données utilisateur lors de la déconnexion
  // clearUserData(): void {
  //   this.userSubject.next(null);
  //   this.userRef = null;
  //   console.log('User service : clearUserData')
  // }
}
