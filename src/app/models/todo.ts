import { ScheduleEvery } from "@capacitor/local-notifications";
import { Notif } from "./notif";
import { TaskConfig } from "./task-config";
import { Category } from "./category";
import { TranslateService } from "@ngx-translate/core";

import { v4 as uuidv4 } from 'uuid';

export class Todo {

    // IDs
    public id? : string; // id of the todo

    public subId?: number; // id of reference on the tree 
    public parentId?: number; // id of the parent todo  

    public mainId?: number; // id of the main todo

    public notifId?: number;


    public main: boolean;  // The todo is main if it have no parent
    public welcomeTodo?: boolean = false;


    public isDone: boolean = false;
    public developped?: boolean = false;  // The todo is developped if we see his sub todos


    // Propriety to choose

    public config!: TaskConfig;
    
    public title: string = '';
    public category: Category;

    public description?: string;

    public priority?: string;

    public date?: Date | string;
    public time?: string;

    public reminder?: boolean;
    

    public repeat?: {
        startDate?: Date | string,
        startTime?: string,
        delayType?: ScheduleEvery,
    };

    public list: Todo[];


    constructor(
        title?: string, category?: Category, main?: boolean) {

        this.id = uuidv4();

        //this.id = id;
        this.main = main || false;
        this.category = category || { name: 'task', color: 'var(--ion-color-tertiary)', id: 0};
        this.title = title || '';

        this.developped = true;

        this.repeat = {};

        this.list = [];

        this.config = new TaskConfig(); 
    }
  }



