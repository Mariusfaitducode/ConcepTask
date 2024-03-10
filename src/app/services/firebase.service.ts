import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, get, DataSnapshot } from 'firebase/database';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
 

  constructor() {
  }

  app = initializeApp({
    apiKey: "AIzaSyA6ChSIyUR6Qdh14Z5gTKZbV-daOrv7MUg",
    authDomain: "todolist-db4bc.firebaseapp.com",
    databaseURL: "https://todolist-db4bc-default-rtdb.firebaseio.com",
    storageBucket: "todolist-db4bc.appspot.com",
    messagingSenderId: "683819826637",
    appId: "1:683819826637:web:d56bf5c5f5f2f8417f5884"
  });
  
  storage = getStorage(this.app);


  // Méthode pour téléverser une image
  async uploadAvatarImage(user: User, file: File): Promise<string> {

    console.log('UPLOAD IMAGE')

    const imageId = Math.random().toString(36).substring(2);

    const storageRef = ref(this.storage, `/users/${user._id}/images/${imageId}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    } 
    catch (error) {
      console.error("Erreur de téléversement : ", error);
      throw error;
    }
  }

  // async getTasks(): Promise<any[]> {

  //   console.log(this.app)

  //   console.log(this.database)

  //   const tasksRef = ref(this.database, 'todos');
  //   const tasksSnapshot = await get(tasksRef);

  //   console.log(tasksSnapshot);

  //   const tasks: any[] = [];
  //   tasksSnapshot.forEach((childSnapshot: DataSnapshot) => {

  //     console.log(childSnapshot.key);
  //     console.log(childSnapshot.val());
  //     tasks.push(childSnapshot.val());
  //   });

  //   return tasks;
  // }
  

  // Ajoutez ici des méthodes pour interagir avec Firebase
}