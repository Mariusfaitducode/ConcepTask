export class Config {

    public description?: boolean;
    public date?: boolean
    public time?: boolean;
    public repetition?: boolean;
    public list?: boolean;

    constructor() {
                this.description = false;
                this.date = false;
                this.time = false;
                this.repetition = false;
                this.list = false;
            }
}
