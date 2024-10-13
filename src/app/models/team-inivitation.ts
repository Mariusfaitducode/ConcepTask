import { Team } from "./team";
import { UserSimplified } from "./user";


export class TeamInvitation {


    teamId: string;
    teamName: string;
    sender: UserSimplified;
    receiverId: string;
    status: string;
    createdAt: Date;

    constructor(team : Team, userId: string, sender: UserSimplified){
        this.teamId = team.id;
        this.teamName = team.name;
        this.sender = sender;
        this.receiverId = userId;
        this.status = 'pending';
        this.createdAt = new Date();
    }
}
