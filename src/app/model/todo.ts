

export class Todo {

    public id: number;
    public title!: string;
    public type: string;

    public description?: string;

    public isChecked?: boolean;

    public date?: Date;

    public reminder?: boolean;

    public repetition?: {
        startDate: Date,
        delay: number,
    };

    public list?: Todo[];


    constructor(id: number, title?: string, type?: string) {

        this.id = id;
        this.type = type || 'customize';
        this.title = title || '';
        this.list = [];
        // this.description = description;
       
    }

}

export class Config{

    public description?: boolean;
    public isChecked?: boolean;
    public date?: boolean
    public reminder?: boolean;
    public repetition?: boolean;
    public list?: boolean;
    

    constructor() {
        this.description = false;
        this.date = false;
        this.reminder = false;
        this.repetition = false;
        this.list = false;
    }

    customizedConfig(){
        this.description = false;
        this.date = false;
        this.reminder = false;
        this.repetition = false;
        this.list = false;
    }

    todoConfig(){
        this.description = false;
        this.date = false;
        this.reminder = false;
        this.repetition = false;
        this.list = false;
    }

    todoListConfig(){
        this.description = true;
        this.date = true;
        this.reminder = true;
        this.repetition = false;
        this.list = true;
    }

    
}
