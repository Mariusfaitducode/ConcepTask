import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Notif } from 'src/app/models/notif';

@Component({
  selector: 'app-custom-config',
  templateUrl: './custom-config.component.html',
  styleUrls: ['./custom-config.component.scss'],
})
export class CustomConfigComponent  implements OnInit {


  @Input() configArray: any;

  @Input() todo: any;

  constructor(public toastController: ToastController) { }

  ngOnInit() {}


  async toggleConfig(key : string){

    let removeNotif = false;
    
    this.configArray[key] = !this.configArray[key];

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
        // Notif.cancelNotification(this.todo);

        let result = await Notif.cancelNotification(this.todo);
        if (result) this.presentToast("Notification canceled");
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

}
