import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-todo-header-top',
  templateUrl: './todo-header-top.component.html',
  styleUrls: ['./todo-header-top.component.scss'],
})
export class TodoHeaderTopComponent  implements OnInit {

  @Input() todo!: Todo;
  @Output() goBackEmitter = new EventEmitter();

  constructor(
    private navCtrl: NavController, ) { }

  ngOnInit() {}


  goBackTodo(){
    // if (this.todoHistoryList.length > 0 && this.subMode == 'tree'){
    //   this.todo = this.todoHistoryList.pop()!;
    // }
    // else{
    //   this.navCtrl.back();
    // }

    this.goBackEmitter.emit();
  }

}
