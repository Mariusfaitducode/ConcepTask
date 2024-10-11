import { Settings } from "./settings";
import { Todo } from "./todo";


export class User{

    uid: string = "";
    
    pseudo: string = "";
    email: string = "";

    avatar?: string = "";

    settings: Settings = new Settings();

    todosTracker: {todoId: string, title: string, date: Date}[] = [];



    // Used to create a new user

    // firstname?: string = "";
    // lastname?: string = "";

    password?: string = "";
    status?: string = "test";
    phone?: string = "test";
}