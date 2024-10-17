import { SettingsService } from "src/app/services/settings/settings.service";
import { Category } from "../category";
import { TaskConfig } from "../task-config";
import { ScheduleEvery } from "@capacitor/local-notifications";



export class TodoProperties{


    public welcomeTodo?: boolean = false;


    public isDone: boolean = false;
    public developped?: boolean = true;  // The todo is developped if we see his sub todos


    
    public config: TaskConfig = new TaskConfig();
    
    public title: string = '';
    public category: Category;

    public description?: string;

    public priority?: string;

    public date?: Date | string;
    public time?: string;

    public reminder: boolean = false;
    public notifId?: number;

    public repeat?: {
        startDate?: Date | string,
        startTime?: string,
        delayType?: ScheduleEvery,
    };

    


    constructor() {

        // this.id = uuidv4();
        
        this.category = SettingsService.getCategories()[0];
        // this.developped = true;

        // this.repeat = {};

        // this.config = new TaskConfig(); 

        // this.index = todoListLength;
    }

}
