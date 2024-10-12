import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TaskService } from '../task/task.service';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private taskService : TaskService,
    private userService: UserService
  ) { }



  getTeamById(teamId: string): Observable<Team | null> {

    return this.firestore.collection('teams').doc(teamId).valueChanges() as Observable<Team | null>;

  }

  getTeamsOfUser(user: User): Observable<Team[]> {

    return this.firestore.collection('teams', ref => ref.where('usersIds', 'array-contains', user.uid)).valueChanges() as Observable<Team[]>;

  }


  createNewTeam(team: Team, user: User){

    // Add the team on the firestore team collection

    team = JSON.parse(JSON.stringify(team));

    if (user){

      if (!user.teams){
        user.teams = [];
      }

      user.teams.push(team.id);

      this.userService.updateUser(user, null);

      this.firestore.collection('teams').doc(team.id).set(team);
    }



  }

}
