import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openModalSubject = new BehaviorSubject<boolean>(false);
  private subTaskSubject = new BehaviorSubject<any>(null);

  openModal$ = this.openModalSubject.asObservable();
  subTask$ = this.subTaskSubject.asObservable();

  constructor() { }

  setOpenModal(value: boolean) {
    this.openModalSubject.next(value);
  }

  setSubTask(subTask: any) {
    this.subTaskSubject.next(subTask);
  }
}
