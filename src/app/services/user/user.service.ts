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
// import { Todo } from 'src/app/models/todo';
import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';
import { HandleErrors } from 'src/app/utils/handle-errors';
import { RequestResponse } from 'src/app/models/firebase-response';

// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userSubject = new BehaviorSubject<User | null>(null);

  private userRef: AngularFirestoreDocument<User> | null = null;

  private userSubscription: Subscription | null = null;

  // private listUsersSimplifiedSubject = new BehaviorSubject<UserSimplified[]>([]);


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
  


  private cachedUsers: Map<string, UserSimplified> = new Map();

  getUserSimplifiedById(uid: string): Promise<UserSimplified | null> {
    // Check if the user is already in the cache
    if (this.cachedUsers.has(uid)) {
      console.log('User service : getUserSimplifiedById : user in cache', uid)
      return Promise.resolve(this.cachedUsers.get(uid) || null);
    }
    else{
      // If not in cache, fetch from Firestore
      console.log('User service : getUserSimplifiedById : user not in cache', uid)
      return this.firestore.doc<User>(`users/${uid}`)
      .get()
      .toPromise()
      .then(doc => {
        if (doc && doc.exists) {
          const data = doc.data();
          if (data) {
            const userSimplified: UserSimplified = { ...data, avatar: data.avatar || '' };
            // Cache the result
            this.cachedUsers.set(uid, userSimplified);
            return userSimplified;
          }
        }
        return null;
      });
    }
  }


  // Retourne un Observable de l'utilisateur actuel
  getUser() {
    return this.userSubject.asObservable();
  }
  

  // TODO : if user is connected, get user data from userSubject, else get user data from firestore

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


  // TODO : check if pseudo already exists optimize, HandleError return error message

  async updateUser(newUser: User): Promise<RequestResponse>{
    try {
      if (this.userRef){

        // if (newUser.pseudo !== this.userSubject.value?.pseudo){
        //   console.log('check if pseudo already exists')
        // const pseudoExists = await this.checkIfPseudoAlreadyExists(newUser.pseudo);
        // if (pseudoExists) {
        //   throw new Error('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
        // }
        // }

        await this.userRef.update(newUser);
      // this.userSubject.next(user); // Mettre à jour l'utilisateur localement
      
        return new RequestResponse(true, '');
      }
      return new RequestResponse(false, 'UserRef does not exist');
    } 
    catch (error) {
      console.error('Error updating user:', error);
      let errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new RequestResponse(false, errorMessage);
    }
  }


  // Met à jour l'utilisateur dans Firestore, y compris la photo de profil
  async updateUserAvatar(user: User, profilePictureFile: File): Promise<RequestResponse> {
    try {
      // Check if a file is provided
      if (!profilePictureFile) {
        console.log('No file to upload');
        return new RequestResponse(false, 'No file to upload');
      }

      const filePath = `profile_pictures/${user.uid}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, profilePictureFile);

      // Return a promise that resolves with the success status
      return new Promise<RequestResponse>((resolve) => {
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
                resolve(new RequestResponse(true, ''));
              } else {
                console.error('UserRef does not exist');
                resolve(new RequestResponse(false, 'UserRef does not exist'));
              }
            } catch (error) {
              console.error('Error getting download URL or updating user:', error);
              // Resolve with false if there's an error
              resolve(new RequestResponse(false, 'Error getting download URL or updating user'));
            }
          })
        ).subscribe();
      });
    } catch (error) {
      // Log any errors that occur during the process
      console.error('Error updating user avatar:', error);
      let errorMessage = HandleErrors.handleFirebaseErrors(error);
      return new RequestResponse(false, errorMessage);
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


  // ! Add new service to update todosTracker ?

  // Set user todos tracker
  setUserTodosTracker(user: User, todo: MainTodo | SubTodo): void {

    if (this.userRef) {

      const todosTracker = [...user.todosTracker] || [];

      if (!todosTracker.some(item => item.todoId === todo.id) && todo.properties.isDone) {
        console.log('PUSH NEW NEW TODO TO TRACKER', todo.id)

        todosTracker.push({ todoId:todo.id, title: todo.properties.title, date: new Date() });
      } 
      else if (todosTracker.some(item => item.todoId === todo.id) && !todo.properties.isDone) {
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


  // Méthode pour vérifier si le pseudo existe déjà
  public async checkIfPseudoAlreadyExists(pseudo: string): Promise<boolean> {

    const usersRef = this.firestore.collection('users', ref => ref.where('pseudo', '==', pseudo));
    const result = await usersRef.get().toPromise();

    // On renvoie true si le pseudo existe déjà
    return  result != undefined && !result.empty;
  }
}
