import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { BehaviorSubject, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
  


  getUserById(uid: string): Promise<{ uid: string; pseudo: string; avatar: string } | null> {
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


  // Met à jour l'utilisateur dans Firestore, y compris la photo de profil
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
