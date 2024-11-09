import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ImportExportModal } from 'src/app/models/import-export-modal';
import { Settings } from 'src/app/models/settings';
import { TaskConfig } from 'src/app/models/task-config';
import { TaskModal } from 'src/app/models/task-modal';
import { Team } from 'src/app/models/team';
import { TeamInvitation } from 'src/app/models/team-inivitation';
// import { Todo } from 'src/app/models/todo';
import { User, UserSimplified } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TeamInvitationsService } from 'src/app/services/team/team-invitations.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UserService } from 'src/app/services/user/user.service';

import { MainTodo } from 'src/app/models/todo/main-todo';
import { SubTodo } from 'src/app/models/todo/sub-todo';
import { Dialog } from '@capacitor/dialog';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  constructor(
    private translate: TranslateService,
    private router : Router,
    private route : ActivatedRoute,
    private userService : UserService,
    private authService : AuthService,
    private settingsService : SettingsService,
    private taskService : TaskService,
    private teamService: TeamService,
    private teamInvitationsService: TeamInvitationsService
  ) { }


  userSubscription! : Subscription;
  user : User | null = new User();
  // userConnected : boolean = false;


  importModalConfig: ImportExportModal = new ImportExportModal();
  // openImportExportModal: boolean = false;

  // todos: MainTodo[] = [];



  ngOnInit() {
    this.userService.getUser().subscribe((user : User | null) => {

      console.log('ProfilePage : user = ', user);
      this.user = user;
      
      if (this.user != null){

        if (!this.user.avatar || this.user.avatar == ""){
          this.user.avatar = "assets/images/default-avatar.jpg";
        }
      }
    });


    // this.taskService.getTodos().subscribe((todos: MainTodo[]) => {

    //   if (this.todos.length != 0 && JSON.stringify(this.todos) == JSON.stringify(todos)) return;

    //   console.log('Todos loaded in profile page:', todos)
    //   this.todos = todos;
    // });

    // Actualise la page à chaque changement
    this.route.queryParams.subscribe(params =>{

      this.settingsService.initPage(this.translate);
    });
  }


  ngOnDestroy(){

    console.log("PROFILE PAGE ON DESTROY")

    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }


  exportSingleTodo(todo: MainTodo) {
    const jsonData = JSON.stringify(todo, null, 2);
    this.downloadJson(jsonData, `todo_${todo.id}.json`);
  }

  private downloadJson(jsonData: string, filename: string) {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);

  }

  usedLanguage(){
    return this.translate.currentLang;
  }

  // * NAVIGATION

  goToPersonnalInformations(){
    this.router.navigate(['tabs/profile/personnal-informations']);
  }

  goToSettings(){
    this.router.navigate(['/settings']);
  }

  goToLogin(){
    this.router.navigate(['tabs/profile/connexion']);
  }

  goToSignUp(){
    this.router.navigate(['tabs/profile/connexion/sign-up']);
  }

  goToEditProfile(){
    this.router.navigate(['tabs/profile/edit-profile']);
  }

  goToFeedback(){
    this.router.navigate(['tabs/feedback']);
  }



  // * DISCONNECT

  async disconnect(){

    console.log('Profile page : disconnect')

    const { value } = await Dialog.confirm({
      title: 'Confirm',
      message: `${this.translate.instant('DISCONNECT MESSAGE')}`,
    });

    // Si l'utilisateur confirme, alors on se déconnecte
    if (value){
      this.user = null;
      // this.taskService.loadTodos(null);
      this.authService.logout();
    }
  }

}
