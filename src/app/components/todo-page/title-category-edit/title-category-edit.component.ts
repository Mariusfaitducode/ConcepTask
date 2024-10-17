import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
// import { Todo } from 'src/app/models/todo';
import { SettingsService } from 'src/app/services/settings/settings.service';


import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';

@Component({
  selector: 'app-title-category-edit',
  templateUrl: './title-category-edit.component.html',
  styleUrls: ['./title-category-edit.component.scss'],
})
export class TitleCategoryEditComponent  implements OnInit {

  @Input() todo!: MainTodo | SubTodo;

  categoryName : string = '';

  categories : Category[] = [];

  constructor(private settingsService : SettingsService) { }

  ngOnInit() {

    this.categories = this.settingsService.getLocalSettings().categories

    // if (!this.todo.category){
    //   this.todo.category = this.categories[0];
    // }
    
    // if (this.categories.find((category: Category) => category === this.todo.category) === undefined){
    //   this.todo.category = this.categories.find((category: Category) => category.id === this.todo.category.id)!;
    // }

    this.categoryName = this.todo.properties.category.name;

  }

  changeCategory(){
    this.todo.properties.category = this.categories.find((category: Category) => category.name === this.categoryName)!;
  }
}
