import { Team } from "./team";
import { UserSimplified } from "./user";

import { v4 as uuidv4 } from 'uuid';


export class TeamInvitation {

    id: string;

    teamId: string;
    teamName: string;
    sender: UserSimplified;
    receiverId: string;
    status: string;
    createdAt: Date;

    constructor(team : Team, userId: string, sender: UserSimplified){

        this.id = uuidv4();

        this.teamId = team.id;
        this.teamName = team.name;
        this.sender = sender;
        this.receiverId = userId;
        this.status = 'pending';
        this.createdAt = new Date();
    }
}
