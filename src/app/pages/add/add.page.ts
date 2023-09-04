import { Component, OnInit } from '@angular/core';

import { NavController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { ItemReorderEventDetail } from '@ionic/core';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  newTodo: any = {
    type: 'project',
    list: []
  }

  canAdd: boolean = false;


  // todoList: any[] = [];

  newTodoOnListTitle: string = "";

  showDate: boolean = false;
  openModal: boolean = false;

  constructor(private navCtrl: NavController, private modalService: ModalService) { }

  ngOnInit() {

    this.modalService.openModal$.subscribe(openModal => {
      if (openModal) {
        this.openModal= true;
      } else {
        this.openModal = false;
      }
    });
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

    this.newTodo.list.push({
      title: this.newTodoOnListTitle,
    });

    this.newTodoOnListTitle = '';
    console.log(this.newTodo);
  }


  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete(this.newTodo.list);

    console.log(this.newTodo.list);
  }
}
