import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private openModalSubject = new BehaviorSubject<boolean>(false);

  openModal$ = this.openModalSubject.asObservable();

  constructor() { }

  setOpenModal(value: boolean) {
    this.openModalSubject.next(value);
  }
}
