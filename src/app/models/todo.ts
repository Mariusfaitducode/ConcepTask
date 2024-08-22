import { ScheduleEvery } from "@capacitor/local-notifications";
import { Notif } from "./notif";
import { TaskConfig } from "./task-config";
import { Category } from "./category";
import { TranslateService } from "@ngx-translate/core";

export class Todo {

    public id? : string; 

    public welcomeTodo?: boolean = false;

    public subId?: number;
    public parentId?: number;

    public main: boolean;
    public mainId?: number;

    public notifId?: number;

    public isDone: boolean = false;

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
    public developped?: boolean = false;


    constructor(title?: string, category?: Category, main?: boolean) {

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



