import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { TaskService } from '../task/task.service';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { UserService } from '../user/user.service';
import { finalize, Observable } from 'rxjs';
import { TeamInvitation } from 'src/app/models/team-inivitation';

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

      // Remove userId from pendingInvitationsUserIds list
      if (teamData.pendingInvitationsUserIds) {
        teamData.pendingInvitationsUserIds = teamData.pendingInvitationsUserIds.filter(id => id !== user.uid);
      }


      user.teams.push(teamId);
      this.userService.updateUser(user);

      // Update the team document
      await teamRef.update(teamData);
      return true;
    } catch (error) {
      console.error('Error adding user to team:', error);
      return false;
    }
  }


 

}
