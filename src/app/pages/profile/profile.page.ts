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
import { Todo } from 'src/app/models/todo';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { TaskService } from 'src/app/services/task/task.service';
import { TeamInvitationsService } from 'src/app/services/team/team-invitations.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UserService } from 'src/app/services/user/user.service';

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
  userConnected : boolean = false;


  importModalConfig: ImportExportModal = new ImportExportModal();
  // openImportExportModal: boolean = false;

  todos: Todo[] = [];

  // TODO : remplacer any par le type User with less properties
  teams: {team:Team, teamUsers:any[]}[] = [];

  teamInvitations: TeamInvitation[] = [];


  ngOnInit() {
    // TODO : add verification to limit the reload of teams
    this.userService.getUser().subscribe((user : User | null) => {

      console.log('ProfilePage : user = ', user);
      this.user = user;
      
      if (this.user != null){

        if (!this.user.avatar || this.user.avatar == ""){
          this.user.avatar = "assets/images/default-avatar.jpg";
        }

        this.userConnected = true;

        // TODO : add verification to limit the reload of teams
        this.teamService.getTeamsOfUser(this.user!).subscribe((teams: Team[]) => {

          console.log('ProfilePage : teams = ', teams);

          this.teams = [];

          for (let team of teams){

            if (!team.image || team.image == ""){
              team.image = "assets/images/default-group.png";
            }

            let newTeam : {team:Team, teamUsers:any[]} = {team: team, teamUsers: []};

            for (let userId of team.usersIds){

              this.userService.getUserById(userId).then(user => {

                if (user) newTeam.teamUsers.push(user);
              });
            }

            this.teams.push(newTeam);
          }
        });

        this.teamInvitationsService.getTeamInvitationsOfUser(this.user.uid).subscribe((invitations: TeamInvitation[]) => {
          
          console.log('ProfilePage : invitations = ', invitations);
          this.teamInvitations = invitations;
        });
      }
    });


    this.taskService.getTodos().subscribe((todos: Todo[]) => {

      if (this.todos.length != 0 && JSON.stringify(this.todos) == JSON.stringify(todos)) return;

      console.log('Todos loaded in profile page:', todos)
      this.todos = todos;

      // this.results = [...this.todos].sort((a, b) => a.index - b.index);
    });

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


  // importData(){

  //   console.log('Importing data...');
  //   const fileInput = document.createElement('input');
  //   fileInput.type = 'file';
  //   fileInput.accept = '.json';
    
  //   fileInput.onchange = (event: any) => {
  //     const file = event.target.files[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         try {
  //           const jsonData = JSON.parse(e.target.result);
  //           if (Array.isArray(jsonData)) {
  //             const importedTodos: Todo[] = jsonData.map(item => {
  //               try {
  //                 const todo = new Todo(0); // Assuming 0 as initial index, adjust if needed
                  
  //                 // Mapping properties
  //                 todo.id = item.id || todo.id;
  //                 todo.title = item.title || '';
  //                 todo.description = item.description;
  //                 todo.category = item.category || SettingsService.getCategories()[0];
  //                 todo.isDone = item.completed || false;
  //                 todo.index = item.index || 0;
                  
  //                 // Additional properties from Todo class
  //                 todo.config = item.config || new TaskConfig();
  //                 todo.reminder = false;
  //                 todo.list = [];
                  
  //                 // Validate required properties
  //                 if (!todo.id || !todo.title || !todo.category) {
  //                   throw new Error('Invalid Todo object: missing required properties');
  //                 }
                  
  //                 return todo;
  //               } catch (error) {
  //                 console.error('Error mapping Todo:', error);
  //                 throw new Error('Failed to map imported data to Todo object');
  //               }
  //             });
  //             console.log('Imported Todos:', importedTodos);
  //             // TODO: Handle the imported todos (e.g., save to service or state)
  //           } else {
  //             console.error('Invalid JSON format. Expected an array.');
  //           }
  //         } catch (error) {
  //           console.error('Error parsing JSON:', error);
  //         }
  //       };
  //       reader.readAsText(file);
  //     }
  //   };
    
  //   fileInput.click();
  // }

  // exportData(){

  //   // this.openImportExportModal = true;

  //   this.importModalConfig.openExportModal(this.todos);


  //   // const actionSheet = await this.actionSheetController.create({
  //   //   header: 'Export Options',
  //   //   buttons: [
  //   //     {
  //   //       text: 'Export All Todos',
  //   //       handler: () => {
  //   //         this.exportAllTodos();
  //   //       }
  //   //     },
  //   //     {
  //   //       text: 'Export Single Todo',
  //   //       handler: () => {
  //   //         this.presentTodoSelectionModal();
  //   //       }
  //   //     },
  //   //     {
  //   //       text: 'Cancel',
  //   //       role: 'cancel'
  //   //     }
  //   //   ]
  //   // });
  //   // await actionSheet.present();
  // }

  // async presentTodoSelectionModal() {
  //   const modal = await this.modalController.create({
  //     component: TodoSelectionModalComponent,
  //     componentProps: {
  //       todos: this.todos
  //     }
  //   });

  //   modal.onDidDismiss().then((result) => {
  //     if (result.data) {
  //       this.exportSingleTodo(result.data);
  //     }
  //   });

  //   return await modal.present();
  // }

  // exportAllTodos() {
  //   const jsonData = JSON.stringify(this.todos, null, 2);
  //   this.downloadJson(jsonData, 'all_todos.json');
  // }

  exportSingleTodo(todo: Todo) {
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

  // Navigation 

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

  disconnect(){

    console.log('Profile page : disconnect')

    // localStorage.removeItem('token');
    this.userConnected = false;
    this.user = null;

    // this.taskService.loadTodos(null);

    this.authService.logout();
  }

}
