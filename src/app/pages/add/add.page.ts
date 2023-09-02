import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  newTodo: any = {}

  canAdd: boolean = false;


  todoList: any[] = [];

  newTodoOnListTitle: string = "";

  showDate: boolean = false;

  constructor(private navCtrl: NavController, private modalController: ModalController) { }

  ngOnInit() {
  }

  saveTodo(){
    console.log(this.newTodo);

    this.navCtrl.navigateForward('/home', {
      state: {
        newTodo: this.newTodo
      }
    });
  }

  addOnList(){

    this.canAdd = false;




    this.todoList.push({
      title: this.newTodoOnListTitle,
    });
    
  }


  async openDatePicker() {

    // console.log("openDatePicker")

    // const modal = await this.modalController.create({
    //   component: 'ion-datetime',
    //   componentProps: {
    //     displayFormat: 'DD/MM/YYYY',
    //     value: this.newTodo.date || new Date().toISOString(),
    //   },
    // });

    // modal.onDidDismiss().then((result) => {
    //   if (result.data && result.data.value) {
    //     this.newTodo.date = result.data.value;
    //   }
    // });

    // return await modal.present();
  }
}
