import { Settings } from "./settings";



export class User{

    uid: string = "";
    
    pseudo: string = "";
    bio?: string = "";
    email: string = "";

    avatar?: string = "";

    settings: Settings = new Settings();

    todosTracker: {todoId: string, title: string, date: Date}[] = [];

    teams: string[] = [];


    // Used to create a new user

    // firstname?: string = "";
    // lastname?: string = "";

    // password?: string = "";
    // status?: string = "test";
    // phone?: string = "test";
}


export class UserSimplified{
    uid : string = "";
    pseudo : string = "";
    avatar? : string = "";

    constructor(uid: string, pseudo: string, avatar?: string){
        this.uid = uid;
        this.pseudo = pseudo;
        this.avatar = avatar;
    }
}