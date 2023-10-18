import { Component, Input, OnInit } from '@angular/core';
import { Todo } from 'src/app/model/todo';

@Component({
  selector: 'app-node-modal',
  templateUrl: './node-modal.component.html',
  styleUrls: ['./node-modal.component.scss'],
})
export class NodeModalComponent implements OnInit {

  

  constructor() { }

  ngOnInit() {}


  closeModal() {
    //this.modalService.closeModal();
    var modal = document.getElementById("modal-node");
    modal!.classList.add('close-modal');

    let selectedNodes = document.getElementsByClassName('selected');

    for (let i = 0; i < selectedNodes.length; i++) {
      selectedNodes[i].classList.remove('selected');
    }
  }

  showConfirm(){}

  validateTodo(){}

  unvalidateTodo(){}

  modifyTodo(){}

}
