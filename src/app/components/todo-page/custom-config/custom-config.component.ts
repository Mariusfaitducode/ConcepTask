import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from '@ionic/angular';
// import { Notif } from 'src/app/models/notif';
import { TaskConfig } from 'src/app/models/task-config';
import { Todo } from 'src/app/models/todo';
import { TodoNotification } from 'src/app/utils/todo-notification';

@Component({
  selector: 'app-custom-config',
  templateUrl: './custom-config.component.html',
  styleUrls: ['./custom-config.component.scss'],
})
export class CustomConfigComponent  implements OnInit {


  @Input() configArray: TaskConfig = new TaskConfig();

  @Input() todo!: Todo;

  constructor(public toastController: ToastController) { }

  ngOnInit() {}


  async toggleConfig(key : string){

    let removeNotif = false;
    
    this.configArray[key as keyof TaskConfig] = !this.configArray[key as keyof TaskConfig];

    if (key == 'date') {
      
      this.configArray['repeat'] = false;
      console.log("dateeeeeeee")

      removeNotif = true;

    }
    else if (key == 'repeat') {
      this.configArray['date'] = false;
      console.log("repeat")

      removeNotif = true;
    }


    if (removeNotif){
      if (this.todo.reminder && this.todo.notifId){
        this.todo.reminder = false;

        let result = await TodoNotification.cancelNotification(this.todo);
        if (result) this.presentToast("Notification canceled");
      }
    }
  }


  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, 
      position: 'bottom',
      // color: 'success',
    });
    toast.present();
  }

}
