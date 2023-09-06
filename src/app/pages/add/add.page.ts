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


  // todoList: any[] = [];

  newTodoOnListTitle: string = "";

  showDate: boolean = false;
  openModal: any = {
    open: false,
    task: null,
    modify: false
  };

  constructor(private navCtrl: NavController, private modalService: ModalService) { }

  ngOnInit() {

    this.modalService.openModal$.subscribe(openModal => {
      if (openModal) {
        this.openModal.open = true;
      } else {
        this.openModal.open = false;
      }
    });
    this.modalService.subTask$.subscribe(subTask => {

      if (subTask) {
        this.newTodo.list.push(subTask);
        subTask = null;
      }
      console.log(this.newTodo);
      //this.subTask = subTask;
      // Vous pouvez effectuer des opérations supplémentaires avec l'objet SubTask ici
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

  addTodoOnList(){

    this.newTodo.list.push({
      type: 'todo',
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


  addTaskOnList(){
    console.log(this.openModal);
    this.openModal.task = {};
    this.openModal.open = true;
    this.openModal.modify = false;
  }


  modifyTaskOnList(subTask : any){
    this.openModal.task = subTask;
    this.openModal.open = true;
    this.openModal.modify = true;
  }
}
