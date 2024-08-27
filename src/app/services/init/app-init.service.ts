import { Injectable } from '@angular/core';
import { UserService } from '../user/user.service';
import { User } from '../../models/user';
import { SettingsService } from '../settings/settings.service';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private userService: UserService,
    private settingsService : SettingsService
  ) {}

  init() {
    const token = localStorage.getItem('token');

    // this.taskService.loadTodos(null);
    

    // this.productService.loadProducts().subscribe();
    // this.sellerService.loadSellers().subscribe();

    console.log('START APP INIT');

    this.settingsService.initSettingsOnAppStart();

    // if (token) {
    //   this.userService.getUser().subscribe((res) => {
          
    //       console.log('App init : User connected:', res);
    //       // this.taskService.loadTodos(res as User);
    //       console.log('Todos loaded');
    //     }
    //   );
    // }
    // else{
    //   // this.taskService.loadTodos(null);
    // }

  }
}
