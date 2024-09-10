import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
})
export class ModalHeaderComponent  implements OnInit {

  @Input() subTask! : Todo;

  @Output() closeSubTaskEmitter = new EventEmitter();
  @Output() addSubTaskEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {}


  closeSubTask(){
    this.closeSubTaskEmitter.emit();
  }

  addSubTask(){

    this.addSubTaskEmitter.emit();
    
  }
}
