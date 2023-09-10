import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../model/todo';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openModalSubject = new BehaviorSubject<number>(0);
  private subTaskSubject = new BehaviorSubject<{level: number, todo:Todo | null} >( {level: 0, todo: null});

  openModal$ = this.openModalSubject.asObservable();
  subTask$ = this.subTaskSubject.asObservable();

  constructor() { }

  setOpenModal(value: number) {
    this.openModalSubject.next(value);
  }

  setSubTask(subTask: {level: number, todo:Todo}) {
    this.subTaskSubject.next(subTask);
  }
}
