import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Todo } from 'src/app/models/todo';

@Component({
  selector: 'app-title-category-edit',
  templateUrl: './title-category-edit.component.html',
  styleUrls: ['./title-category-edit.component.scss'],
})
export class TitleCategoryEditComponent  implements OnInit {

  @Input() todo!: Todo;

  categoryName : string = '';

  categories : Category[] = [];

  constructor() { }

  ngOnInit() {}

  changeCategory(){
    
  }
}
