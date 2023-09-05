import { Component, Input, OnInit } from '@angular/core';
import { ItemReorderEventDetail, ModalController, NavController } from '@ionic/angular';
import { ModalService } from 'src/app/service/modal.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent  implements OnInit {

  // @Input() openModal : boolean = true;

  @Input() subTask : any = {}

  @Input() modify : boolean = false;

  newTodoOnListTitle: string = "";

  showDate: boolean = false;

  constructor(private modalService: ModalService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalService.setOpenModal(true);
  }
  
  closeModal() {
    this.modalService.setOpenModal(false);
  }

  addSubTask(){
    this.closeModal();
    this.modalService.setSubTask(this.subTask);
  }

  addOnList(){

    this.subTask.list.push({
      title: this.newTodoOnListTitle,
    });

    this.newTodoOnListTitle = '';
    // console.log(this.newTodo);
  }


  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // The `from` and `to` properties contain the index of the item
    // when the drag started and ended, respectively
    console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);

    // Finish the reorder and position the item in the DOM based on
    // where the gesture ended. This method can also be called directly
    // by the reorder group
    ev.detail.complete(this.subTask.list);

    console.log(this.subTask.list);
  }

}
