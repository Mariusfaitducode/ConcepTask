import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TaskService } from '../task/task.service';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { UserService } from '../user/user.service';
import { BehaviorSubject, Observable, finalize, tap, map } from 'rxjs';
import { TeamInvitation } from 'src/app/models/team-inivitation';
import { RequestResponse } from 'src/app/models/firebase-response';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  // teams$: Observable<Team[]> = this.teamsSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private taskService: TaskService,
    private userService: UserService
  ) { }



  getTeamById(teamId: string): Observable<Team | null> {

    // Check if the team is already in the teamsSubject
    const cachedTeam = this.teamsSubject.value.find(team => team.id === teamId);
    if (cachedTeam) {
      // Create a new Observable that immediately emits the cached team
      return new Observable(observer => {
        // Emit the cached team as the next value
        observer.next(cachedTeam);
        // Complete the Observable since we only need to emit one value
        observer.complete();
      });
    }
    else{
      return this.firestore.collection('teams').doc(teamId).valueChanges() as Observable<Team | null>;
    }


    // return this.firestore.collection('teams').doc(teamId).valueChanges() as Observable<Team | null>;
  }
  

  getTeamsOfUser(user: User): Observable<Team[]> {
    if (!user.teams || user.teams.length === 0) {
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    if (this.teamsSubject.value.length != 0){
      console.log('Teams of user already in cache :', this.teamsSubject.value);
      return this.teamsSubject.asObservable();
    }
    else
    {
      console.log('Teams of user not in cache :', user.teams);
      return this.firestore.collection('teams', ref => ref.where('id', 'in', user.teams))
      .valueChanges()
      .pipe(
        map((response: any) => response as Team[]),
        tap((teams: Team[]) => {
          this.teamsSubject.next(teams);
        })
      ) as Observable<Team[]>;
    }
  }


  createNewTeam(team: Team, user: User){

    // Add the team on the firestore team collection

    try{

      team = JSON.parse(JSON.stringify(team));

      if (user){

        if (!user.teams){
          user.teams = [];
        }

        user.teams.push(team.id);

        this.userService.updateUser(user);

        this.firestore.collection('teams').doc(team.id).set(team);
        return true;
      }
      return false;
    }
    catch(error){
      console.error('Error creating new team:', error);
      return false;
    }
  }


  async updateTeamImage(team: Team, file: File): Promise<boolean> {
    try {
      // Check if a file is provided
      if (!file) {
        console.log('No file to upload');
        return false;
      }

      const filePath = `team_pictures/${team.id}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      // Return a promise that resolves with the success status
      return new Promise<boolean>((resolve) => {
        uploadTask.snapshotChanges().pipe(
          finalize(async () => {
            try {
              // Get the download URL of the uploaded file
              const downloadURL = await fileRef.getDownloadURL().toPromise();
              // Update the team's image URL
              team.image = downloadURL;
              // Update the team in the database
              const updateSuccess = await this.updateTeam(team);
              // Resolve the promise with the update status
              resolve(updateSuccess);
            } catch (error) {
              console.error('Error getting download URL or updating team:', error);
              // Resolve with false if there's an error
              resolve(false);
            }
          })
        ).subscribe();
      });
    } catch (error) {
      // Log any errors that occur during the process
      console.error('Error updating team image:', error);
      return false;
    }
  }


  updateTeam(team: Team){

    try{

      team = JSON.parse(JSON.stringify(team));

      this.firestore.collection('teams').doc(team.id).update(team);
      return true;
    }
    catch(error){
      console.error('Error updating team:', error);
      return false;
    }
  }



  async addUserToTeam(teamId: string, user: User): Promise<boolean> {
    try {
      const teamRef = this.firestore.collection('teams').doc(teamId);
      const teamDoc = await teamRef.get().toPromise();

      if (!teamDoc || !teamDoc.exists) {
        console.error('Team not found');
        return false;
      }

      const teamData = teamDoc.data() as Team;

      // Add userId to userIds list
      if (!teamData.usersIds) {
        teamData.usersIds = [];
      }
      if (!teamData.usersIds.includes(user.uid)) {
        teamData.usersIds.push(user.uid);
      }

      // Add teamId to user's teams list
      if (!user.teams){
        user.teams = [];
      }

      user.teams.push(teamId);
      this.userService.updateUser(user);


      // Remove userId from pendingInvitationsUserIds list
      if (teamData.pendingInvitationsUserIds) {
        teamData.pendingInvitationsUserIds = teamData.pendingInvitationsUserIds.filter(id => id !== user.uid);
      }

      // Update the team document
      await teamRef.update(teamData);
      return true;
    } catch (error) {
      console.error('Error adding user to team:', error);
      return false;
    }
  }


  async removeUserFromPendingInvitations(teamId: string, userId: string){
    try {
      const teamRef = this.firestore.collection('teams').doc(teamId);
      const teamDoc = await teamRef.get().toPromise();
      
      if (!teamDoc || !teamDoc.exists) {
        console.error('Team not found');
        return false;
      }

      const teamData = teamDoc.data() as Team;

      // Remove userId from pendingInvitationsUserIds list
      if (teamData.pendingInvitationsUserIds) {
        teamData.pendingInvitationsUserIds = teamData.pendingInvitationsUserIds.filter(id => id !== userId);
      } 

      await teamRef.update(teamData);
      return true;
    }
    catch(error){
      console.error('Error removing user from pending invitations:', error);
      return false;
    }
  }


  async deleteTeam(team: Team): Promise<RequestResponse> {
    try{
      await this.firestore.collection('teams').doc(team.id).delete();
      
      return new RequestResponse(true, 'Team deleted successfully');
    }
    catch(error){
      console.error('Error deleting team:', error);
      return new RequestResponse(false, 'Error deleting team');
    }
  }


  async leaveTeam(team: Team, user: User): Promise<RequestResponse> {
    try {

      // Remove user from team members list
      if (team.usersIds) {
        team.usersIds = team.usersIds.filter(id => id !== user.uid);
      }

      await this.firestore.collection('teams').doc(team.id).update(team);

      // Remove team from user's teams list
      if (user.teams) {
        user.teams = user.teams.filter(id => id !== team.id);
      }

      this.userService.updateUser(user);

      return new RequestResponse(true, 'Successfully left team');
    } catch (error) {
      console.error('Error leaving team:', error);
      return new RequestResponse(false, 'Error leaving team');
    }
  }

}
