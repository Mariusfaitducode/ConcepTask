import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { TaskService } from './task.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private userService: UserService,
    private taskService: TaskService,) {}

  init() {
    const token = localStorage.getItem('token');

    // this.taskService.loadTodos(null);
    

    // this.productService.loadProducts().subscribe();
    // this.sellerService.loadSellers().subscribe();

    if (token) {
      this.userService.getUserWithToken().subscribe((res) => {
          
          console.log('User connected:', res);
          this.taskService.loadTodos(res as User);
          console.log('Todos loaded');
        }
      );
    }
    else{
      this.taskService.loadTodos(null);
    }

  }
}
