

export class Todo {

    //public id: number;
    public main: boolean;
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


    constructor(title?: string, type?: string, main?: boolean) {

        //this.id = id;
        this.main = main || true;
        this.type = type || 'customize';
        this.title = title || '';
        this.list = [];
        // this.description = description;
       
    }

}

// export class TypeTodo{
    
//         public type: string;
//         public color: string;

//         // Config could be on type
    
//         constructor() {
//             this.type = 'customize';
//             this.color = '';
//         }
    
// }

// export class Config{

//     public description?: boolean;
//     public isChecked?: boolean;
//     public date?: boolean
//     public reminder?: boolean;
//     public repetition?: boolean;
//     public list?: boolean;
    

//     constructor() {
//         this.description = false;
//         this.date = false;
//         this.reminder = false;
//         this.repetition = false;
//         this.list = false;
//     }

//     customizedConfig(){
//         this.description = false;
//         this.date = false;
//         this.reminder = false;
//         this.repetition = false;
//         this.list = false;
//     }

//     todoConfig(){
//         this.description = false;
//         this.date = false;
//         this.reminder = false;
//         this.repetition = false;
//         this.list = false;
//     }

//     todoListConfig(){
//         this.description = true;
//         this.date = true;
//         this.reminder = true;
//         this.repetition = false;
//         this.list = true;
//     }

    
// }
