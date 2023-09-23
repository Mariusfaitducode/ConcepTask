import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../model/todo';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openModalSubject = new BehaviorSubject<number>(0);
  private subTaskSubject = new BehaviorSubject<Todo | null >(null);

  openModal$ = this.openModalSubject.asObservable();
  subTask$ = this.subTaskSubject.asObservable();

  constructor() { }

  // setOpenModal(value: number) {
  //   this.openModalSubject.next(value);
  // }

  // setSubTask(subTask: Todo) {
  //   this.subTaskSubject.next(subTask);
  // }
}
