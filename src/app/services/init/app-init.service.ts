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

  async init() {

    console.log('START APP INIT');

    await this.userService.initUserService();

    console.log('START APP INIT USER')

    this.settingsService.initSettingsOnAppStart();

    console.log('START APP SETTINGS')
  }
}
