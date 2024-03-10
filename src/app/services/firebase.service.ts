import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';

import { getDatabase, ref, get, DataSnapshot } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app: any; // Firebase app instance
  private database: any; // Firebase database instance

  constructor() {
    // Initialize Firebase using your configuration
    this.app = initializeApp({
      apiKey: "AIzaSyA6ChSIyUR6Qdh14Z5gTKZbV-daOrv7MUg",
      authDomain: "todolist-db4bc.firebaseapp.com",
      databaseURL: "https://todolist-db4bc-default-rtdb.firebaseio.com",
      storageBucket: "todolist-db4bc.appspot.com",
      messagingSenderId: "683819826637",
      appId: "1:683819826637:web:d56bf5c5f5f2f8417f5884"
    });

    // Get a reference to the database
    this.database = getDatabase(this.app);
  }

  

  async getTasks(): Promise<any[]> {

    console.log(this.app)

    console.log(this.database)

    const tasksRef = ref(this.database, 'todos');
    const tasksSnapshot = await get(tasksRef);

    console.log(tasksSnapshot);

    const tasks: any[] = [];
    tasksSnapshot.forEach((childSnapshot: DataSnapshot) => {

      console.log(childSnapshot.key);
      console.log(childSnapshot.val());
      tasks.push(childSnapshot.val());
    });

    return tasks;
  }
  

  // Ajoutez ici des méthodes pour interagir avec Firebase
}