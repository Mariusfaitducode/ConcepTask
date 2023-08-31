import { Component } from '@angular/core';

import { FirebaseService } from '../service/firebase.service';

//import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private service : FirebaseService) {}

  todos : any[] = []

  ngOnInit() {
    this.service.getTasks().then((tasks: any[]) => {
      console.log(tasks);
      this.todos = tasks;
    });
  }

  // app = initializeApp(environnement.firebaseConfig);
}
