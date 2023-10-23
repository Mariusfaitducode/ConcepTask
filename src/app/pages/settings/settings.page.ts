import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor() {
      // let settings = JSON.parse(localStorage.getItem('settings') || '{}');

      this.darkMode = this.settings.darkMode;
    }

  settings = JSON.parse(localStorage.getItem('settings') || '{}');
  darkMode : boolean = false;

  categories : any[] = [];

  newCategory : any = {};

  ngOnInit() {

    this.categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
  }



  showConfirmDelete(cat : any) {
    Dialog.confirm({
      title: 'Delete category',
      message: `Are you sure you want to delete ${cat.name} category ?`,
      okButtonTitle: 'Delete',
      cancelButtonTitle: 'Cancel',
    }).then((result) => {
      if (result.value) {
        this.removeCategory(cat);
      }
    });
  }


  removeCategory(cat : any){
    this.categories = this.categories.filter((c) => c.id !== cat.id);
    this.saveCategory();
  }

  addCategory(){

    if (!this.newCategory.name) return;
    this.categories.push({
      id: this.categories.length,
      name: this.newCategory.name,
      color: this.newCategory.color,
    });

    this.newCategory = {};
    this.saveCategory();
  }


  onColorChange(event: Event, cat : any) {
    const colorInput = event.target as HTMLInputElement;
    const selectedColor = colorInput.value;
    cat.color = selectedColor;

    this.updateColorCategory(cat);

    this.saveCategory();
  }


  updateColorCategory(cat : any){
    let todos = JSON.parse(localStorage.getItem('todos') || '[]');

    todos.forEach((todo : any) => {
      if (todo.category.name == cat.name){
        todo.category.color = cat.color;
      }
    });

    localStorage.setItem('todos', JSON.stringify(todos));
  }


  saveCategory(){
    console.log(this.categories);
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }


  toggleDarkMode() {

    if (this.darkMode) {
      document.body.setAttribute('color-theme', 'dark');      
    }
    else{
      document.body.setAttribute('color-theme', 'light');
    }
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }

}
