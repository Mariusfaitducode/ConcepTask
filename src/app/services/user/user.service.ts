import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, UserSimplified } from '../../models/user';
import { async, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TaskService } from '../task/task.service';
import { SettingsService } from '../settings/settings.service';
import { Todo } from 'src/app/models/todo';

// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User | null>(null);

  private userRef: AngularFirestoreDocument<User> | null = null;

  private userSubscription: Subscription | null = null;


  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private taskService : TaskService,
  ) {}

  // Initialise le service utilisateur
  async initUserService(){
    // S'abonne à l'état d'authentification pour obtenir l'utilisateur actuel au démarrage, à la connexion ou à la déconnexion
    this.afAuth.authState.subscribe(user => {
      console.log('init user', user )
      if (user) {
        this.setUserSubscription(user.uid);
      } else {
        this.clearUserSubscription();
      }
    });
  }


  // Configure l'abonnement aux données de l'utilisateur
  private setUserSubscription(uid: string): void {
    // Nettoie l'abonnement précédent s'il existe
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    console.log('User service : setUserSubscription')
    
    this.userRef = this.firestore.doc<User>(`users/${uid}`);

    this.userSubscription = this.userRef.valueChanges().subscribe(userData => {
      this.taskService.setUserId(userData!);
      this.userSubject.next(userData as User);
    });
  }


  // Nettoie l'abonnement utilisateur
  private clearUserSubscription(): void {
    // Désabonner et nettoyer l'utilisateur lorsque déconnecté

    console.log('User service : clearUserSubscription')

    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
      this.userSubscription = null;
    }
    this.userSubject.next(null);
  }
  


  getUserById(uid: string): Promise<UserSimplified | null> {
    return this.firestore.doc<User>(`users/${uid}`)
      .get()
      .toPromise()
      .then(doc => {
        if (doc && doc.exists){
          const data = doc.data();
          return data ? { ...data, avatar: data.avatar || '' } : null;
        }
        return null;
      });
  }


  // Retourne un Observable de l'utilisateur actuel
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



  async updateUser(user: User){
    try {
      if (this.userRef){
        await this.userRef.update(user);
      // this.userSubject.next(user); // Mettre à jour l'utilisateur localement
      
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }


  // Met à jour l'utilisateur dans Firestore, y compris la photo de profil
  async updateUserAvatar(user: User, profilePictureFile: File): Promise<boolean> {
    try {
      // Check if a file is provided
      if (!profilePictureFile) {
        console.log('No file to upload');
        return false;
      }

      const filePath = `profile_pictures/${user.uid}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, profilePictureFile);

      // Return a promise that resolves with the success status
      return new Promise<boolean>((resolve) => {
        uploadTask.snapshotChanges().pipe(
          finalize(async () => {
            try {
              // Get the download URL of the uploaded file
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              // Update the user's avatar URL
              user.avatar = downloadURL;
              // Update the user in the database
              if (this.userRef) {
                await this.userRef.update(user);
                resolve(true);
              } else {
                console.error('UserRef does not exist');
                resolve(false);
              }
            } catch (error) {
              console.error('Error getting download URL or updating user:', error);
              // Resolve with false if there's an error
              resolve(false);
            }
          })
        ).subscribe();
      });
    } catch (error) {
      // Log any errors that occur during the process
      console.error('Error updating user avatar:', error);
      return false;
    }
  }


  // Take a string input and search for users with a pseudo or email containing the input
  async searchMembers(input: string): Promise<UserSimplified[]> {
    
    const pseudoQuery = this.firestore.collection<User>('users', ref => 
      ref.where('pseudo', '>=', input.toLowerCase())
         .where('pseudo', '<=', input.toLowerCase() + '\uf8ff')
         .orderBy('pseudo')
         .limit(10)
    );

    const emailQuery = this.firestore.collection<User>('users', ref => 
      ref.where('email', '>=', input.toLowerCase())
         .where('email', '<=', input.toLowerCase() + '\uf8ff')
         .orderBy('email')
         .limit(10)
    );

    // Get the results from the queries
    const [pseudoResults, emailResults] = await Promise.all([
      pseudoQuery.get().toPromise(),
      emailQuery.get().toPromise()
    ]);

    const pseudoUsers = pseudoResults?.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        pseudo: data.pseudo,
        avatar: data.avatar
      } as UserSimplified;
    }) || [];

    const emailUsers = emailResults?.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        pseudo: data.pseudo,
        avatar: data.avatar
      } as UserSimplified;
    }) || [];

    // Combine and remove duplicates
    const combinedUsers = [...pseudoUsers, ...emailUsers];
    return Array.from(new Set(combinedUsers.map(user => user.uid)))
      .map(uid => combinedUsers.find(user => user.uid === uid)!);
  }



  // Set user todos tracker
  setUserTodosTracker(user: User, todo: Todo): void {

    if (this.userRef) {

      const todosTracker = [...user.todosTracker] || [];

      if (!todosTracker.some(item => item.todoId === todo.id) && todo.isDone) {
        console.log('PUSH NEW NEW TODO TO TRACKER', todo.id)

        todosTracker.push({ todoId:todo.id, title: todo.title, date: new Date() });
      } 
      else if (todosTracker.some(item => item.todoId === todo.id) && !todo.isDone) {
        console.log('REMOVE TODO FROM TRACKER', todo.id)
        todosTracker.splice(todosTracker.findIndex(item => item.todoId === todo.id), 1);
      }

      if (user.todosTracker !== todosTracker) {
        this.userRef.update({
          todosTracker: todosTracker
        });
      }
    }
  }
}
