import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ImportExportModal } from 'src/app/models/import-export-modal';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-import-export-modal',
  templateUrl: './import-export-modal.component.html',
  styleUrls: ['./import-export-modal.component.scss'],
})
export class ImportExportModalComponent implements OnInit, AfterViewInit {


  // @Input()openModal: boolean = false;

  // type: 'import' | 'export' = 'export';

  // importTodo: Todo = new Todo(0); 

  // @Input() todos: Todo[] = [];

  @Input() importExportModal: ImportExportModal = new ImportExportModal();

  
  constructor() { }

  ngOnInit() {

    console.log(this.importExportModal);
  }


  ngAfterViewInit() {
    
    let doc = document.getElementsByClassName('content');

    for (let con of Array.from(doc)) {
      con.classList.add('start-effect');
    }
  }


  closeModal(){
    this.importExportModal.open = false;
  }




}
