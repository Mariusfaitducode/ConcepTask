import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notif } from 'src/app/models/notif';
import { Todo } from 'src/app/models/todo';

import { ToastController } from '@ionic/angular';
import { set } from 'firebase/database';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TodoDate } from 'src/app/utils/todo-date';
import { TodoNotification } from 'src/app/utils/todo-notification';

@Component({
  selector: 'app-date-selector',
  templateUrl: './date-selector.component.html',
  styleUrls: ['./date-selector.component.scss'],
})
export class DateSelectorComponent  implements OnInit {

  @Input() todo!: Todo;

  @Input() editMode : boolean = false;

  @Input() page?: string;


  // date : Date = new Date();

  constructor(public toastController: ToastController,
                private translate : TranslateService,
                private router : Router) { }

  ngOnInit() {

    console.log('date selector todo',this.todo)

    // if (!this.todo.repeat){
    //   this.todo.repeat = {};
    // }

    // let date = new Date();

    // console.log(date)

    // const year = date.getFullYear(); // Obtenir l'année au format complet (YYYY)
    // const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Obtenir le mois au format deux chiffres (MM)
    // const day = date.getDate().toString().padStart(2, "0"); // Obtenir le jour au format deux chiffres (DD)

    // const formattedDate = `${year}-${month}-${day}`;

    // if (!this.todo.repeat?.startDate){
    //   this.todo.repeat.startDate = formattedDate;
    // }
    // if (!this.todo.date){
    //   this.todo.date = formattedDate;
    // }

    // const hours = date.getHours().toString().padStart(2, "0"); // Obtenir l'heure au format deux chiffres (HH)
    // const minutes = date.getMinutes().toString().padStart(2, "0"); // Obtenir les minutes au format deux chiffres (MM)

    // const formattedTime = `${hours}:${minutes}`;

    // if (!this.todo.time){
    //   this.todo.time = formattedTime;
    // }
    // if (!this.todo.repeat?.startTime){
    //   this.todo.repeat.startTime = formattedTime;
    // }

  }

  async manageNotification(){
    console.log("click")

    console.log("manage notification")
    console.log(this.todo.reminder);
    // this.newTodo.sayHello();

    if (this.todo.reminder && TodoDate.passedDate(this.todo)){ // si la date est passée
      this.presentToast(`${this.translate.instant('DATE PASSED')}`);

      setTimeout(() => {
      this.todo.reminder = false;

      }, 300);
      return;
    }


    if (this.todo.reminder) {
      let result = await TodoNotification.scheduleNotification(this.todo, this.router);

      if (result){
        // console.log("notification scheduled")
        this.presentToast(`${this.translate.instant('NOTIF SCHEDULED')}`);

      }
      else{
        this.presentToast(`${this.translate.instant('NOTIF PROBLEM')}`);
        // console.log("notification not scheduled")
      }

    }
    else{
      let result = await TodoNotification.cancelNotification(this.todo);
      if (result) this.presentToast(`${this.translate.instant('NOTIF CANCELED')}`);
    }
  }

  repeatReminderPossible(){
    return this.todo.repeat?.startDate && this.todo.repeat?.startTime && this.todo.repeat?.delayType;
  }

  async manageRepeatNotification(){

    if (this.todo.reminder && TodoDate.passedDate(this.todo)){
      this.presentToast(`${this.translate.instant('DATE PASSED')}`);

      setTimeout(() => {
      this.todo.reminder = false;

      }, 300);
      return;
    }

    if (this.todo.reminder) {
      let result = await TodoNotification.scheduleNotification(this.todo, this.router);

      if (result){
        // console.log("notification scheduled")
        this.presentToast(`${this.translate.instant('NOTIF SCHEDULED')}`);
      }
      else{
        // console.log("notification not scheduled")
        this.presentToast(`${this.translate.instant('NOTIF PROBLEM')}`);

      }
    }
    else{
      let result = await TodoNotification.cancelNotification(this.todo);
      if (result) this.presentToast(`${this.translate.instant('NOTIF CANCELED')}`);
    }
  }


  async updateNotification(){

    if ( this.todo.reminder && TodoDate.passedDate(this.todo)){
      this.presentToast(`${this.translate.instant('DATE PASSED')}`);
      return;
    }

    console.log("update notification")

    if (this.todo.reminder){
      let result = await TodoNotification.cancelNotification(this.todo);
      if (result){
        let result = await TodoNotification.scheduleNotification(this.todo, this.router);
        if (result){
          this.presentToast(`${this.translate.instant('NOTIF UPDATE')}`);
        }
      }
    }
  }


  async updateRepeatNotification(){

    if (this.todo.reminder && TodoDate.passedDate(this.todo)){
      this.presentToast(`${this.translate.instant('DATE PASSED')}`);
      return;
    }

    if (this.todo.reminder){
      let result = await TodoNotification.cancelNotification(this.todo);
      if (result){
        let result = await TodoNotification.scheduleNotification(this.todo, this.router);
        if (result){
          this.presentToast(`${this.translate.instant('NOTIF UPDATE')}`);
        }
      }
    }
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Durée d'affichage du toast en millisecondes
      position: 'bottom', // Position du toast (top, middle, bottom)
      // color: 'success', // Couleur du toast (vous pouvez utiliser 'danger' pour une couleur rouge, etc.)
    });
    toast.present();
  }


  // VISU

  passedDate(){
    return TodoDate.passedDate(this.todo);
  }


  formatDateToCustomString() {
    return TodoDate.formatDateToCustomString(this.todo, this.translate); 
  }


  validDate(){
    if (this.todo.config.date){
      let date = TodoDate.getDate(this.todo.date!, this.todo.time);
      let now = new Date();
      return date! > now;
    }
    if (this.todo.config.repeat && this.todo.repeat!.delayType){
      return true;
    }
    return false;
  }
}
