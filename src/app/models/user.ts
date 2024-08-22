import { Todo } from "./todo";


export class User{

    uid: string = "";
    
    pseudo: string = "";
    email: string = "";

    avatar?: string = "";
    // todos : Todo[] = [];


    // Used to create a new user

    firstname?: string = "";
    lastname?: string = "";

    password?: string = "";
    status?: string = "test";
    phone?: string = "test";
}