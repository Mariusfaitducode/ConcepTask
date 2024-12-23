import { ScheduleEvery } from "@capacitor/local-notifications";
// import { Notif } from "./notif";
import { TaskConfig } from "./task-config";
import { Category } from "./category";
import { TranslateService } from "@ngx-translate/core";

import { v4 as uuidv4 } from 'uuid';
import { SettingsService } from "../services/settings/settings.service";

export class Todo {

    // IDs
    public id: string; // id of the todo

    public index: number; // index of the todo in the list

    public subId?: number; // id of reference on the tree 
    public parentId?: number; // id of the parent todo  

    // public mainId?: string; // id of the main todo

    public notifId?: number;


    // public main: boolean = false;  // The todo is main if it have no parent
    public welcomeTodo?: boolean = false;


    public isDone: boolean = false;
    public developped?: boolean = false;  // The todo is developped if we see his sub todos

    public hideDoneTasks: boolean = false; // Hide the done tasks only useful for mainTodo

    // Propriety to choose

    public config!: TaskConfig;
    
    public title: string = '';
    public category: Category;

    public description?: string;

    public priority?: string;

    public date?: Date | string;
    public time?: string;

    public reminder: boolean = false;
    
    // TODO : add a class for repeat
    public repeat?: {
        startDate?: Date | string,
        startTime?: string,
        delayType?: ScheduleEvery,
    };

    public list: Todo[] = [];


    constructor(todoListLength: number) {

        this.id = uuidv4();
        
        this.category = SettingsService.getCategories()[0];
        this.developped = true;

        this.repeat = {};

        this.config = new TaskConfig(); 

        this.index = todoListLength;
    }


    // initializeMainTodo(){
    //     this.main = true;
    // }

  }



