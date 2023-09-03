import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { ItemReorderEventDetail } from '@ionic/core';

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


  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete();
  }
}
