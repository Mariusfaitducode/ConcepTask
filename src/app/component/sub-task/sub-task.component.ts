import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-task',
  templateUrl: './sub-task.component.html',
  styleUrls: ['./sub-task.component.scss'],
})
export class SubTaskComponent  implements OnInit {

  constructor() { }

  @Input() subTask: any;
  @Input() todo: any;
  @Input() index: any;
  @Input() page: string = "";

  ngOnInit() {}

  deleteSubTask(){
    this.todo.list.splice(this.index, 1);
  }


}
