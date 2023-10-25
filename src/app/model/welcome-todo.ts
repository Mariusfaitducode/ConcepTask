export class WelcomeTodo {


    public static getWelcomeTodo(){

        return {
           "isDone": false,
           "developped": false,
           "main": true,
           "category": {
               "id": 4,
               "name":"event",
               "color":"#5d58e0"
            },
           "title":"Welcome in ConcepTask",
           "list": [{
                   "isDone": false,
                   "developped": true,
                   "main": false,
                   "category": {
                       "id": 0,
                       "name":"task",
                       "color":"#e83c53"
                    },
                   "title":"Modulability",
                   "list": [{
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion - color - tertiary)",
                               "id": 0
                            },
                           "title":"Tree representation",
                           "list": [],
                           "config": {
                               "description": true,
                               "priority": false,
                               "date": false,
                               "repeat": false,
                               "subtasks": false
                            },
                           "repeat": {},
                           "description":"It 's more like a todo tree. \nYou can add as many todos to todos that are in other todos, and so on.",
                           "parentId": 1,
                           "mainId": 148,
                           "subId": 5
                        }, {
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion-color-tertiary)",
                               "id": 0
                            },
                           "title":"Drag & drop",
                           "list": [],
                           "config": {
                               "description": true,
                               "priority": true,
                               "date": false,
                               "repeat": false,
                               "subtasks": false
                            },
                           "repeat": {},
                           "description":"You can drag and drop elements to restructure the project as you wish.",
                           "mainId": 148,
                           "subId": 6,
                           "parentId": 1,
                           "priority":"medium"
                        }, {
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion-color-tertiary)",
                               "id": 0
                            },
                           "title":"Task property",
                           "list": [],
                           "config": {
                               "description": true,
                               "priority": true,
                               "date": false,
                               "repeat": false,
                               "subtasks": false
                            },
                           "repeat": {},
                           "description":"When you create or modify a task, you can choose the properties of your task, for example whether it needs a description, a date, sub-tasks...",
                           "mainId": 148,
                           "subId": 7,
                           "parentId": 1,
                           "priority":"low"
                        }
                    ],
                   "config": {
                       "description": false,
                       "priority": false,
                       "date": false,
                       "repeat": false,
                       "subtasks": true
                    },
                   "repeat": {},
                   "description":"",
                   "mainId": 148,
                   "subId": 1,
                   "parentId": 0
                }, {
                   "isDone": false,
                   "developped": true,
                   "main": false,
                   "category": {
                       "name":"task",
                       "color":"var(--ion-color-tertiary)",
                       "id": 0
                    },
                   "title":"Visualisation",
                   "list": [{
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion-color-tertiary)",
                               "id": 0
                            },
                           "title":"Conceptor",
                           "list": [],
                           "config": {
                               "description": true,
                               "priority": true,
                               "date": false,
                               "repeat": false,
                               "subtasks": false
                            },
                           "repeat": {},
                           "mainId": 148,
                           "subId": 8,
                           "parentId": 2,
                           "priority":"high",
                           "description":"You' ve probably already seen it. \nThe button with the green links. \nDon 't hesitate, click it !"
                        }, {
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion-color-tertiary)",
                               "id": 0
                            },
                           "title":"Calendar",
                           "list": [],
                           "config": {
                               "description": true,
                               "priority": true,
                               "date": false,
                               "repeat": false,
                               "subtasks": false
                            },
                           "repeat": {},
                           "mainId": 148,
                           "subId": 9,
                           "parentId": 2,
                           "description":"A todo list application must have a calendar. Go to the home page, left-hand menu. \nIt' s up to you to fill it in",
                           "priority":"medium"
                        }
                    ],
                   "config": {
                       "description": false,
                       "priority": false,
                       "date": false,
                       "repeat": false,
                       "subtasks": true
                    },
                   "repeat": {},
                   "mainId": 148,
                   "subId": 2,
                   "parentId": 0
                }, {
                   "isDone": false,
                   "developped": true,
                   "main": false,
                   "category": {
                       "name":"task",
                       "color":"var(--ion - color - tertiary)",
                       "id": 0
                    },
                   "title":"Classic concepts",
                   "list": [{
                           "isDone": true,
                           "developped": true,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion - color - tertiary)",
                               "id": 0
                            },
                           "title":"Task done",
                           "list": [{
                                   "isDone": true,
                                   "developped": false,
                                   "main": false,
                                   "category": {
                                       "name":"task",
                                       "color":"var(--ion - color - tertiary)",
                                       "id": 0
                                    },
                                   "title":"done 1",
                                   "list": [],
                                   "config": {
                                       "description": false,
                                       "priority": false,
                                       "date": false,
                                       "repeat": false,
                                       "subtasks": false
                                    },
                                   "repeat": {},
                                   "mainId": 148,
                                   "subId": 13,
                                   "parentId": 10
                                }, {
                                   "isDone": true,
                                   "developped": false,
                                   "main": false,
                                   "category": {
                                       "name":"task",
                                       "color":"var(--ion - color - tertiary)",
                                       "id": 0
                                    },
                                   "title":"done 2",
                                   "list": [],
                                   "config": {
                                       "description": false,
                                       "priority": false,
                                       "date": false,
                                       "repeat": false,
                                       "subtasks": false
                                    },
                                   "repeat": {},
                                   "mainId": 148,
                                   "subId": 14,
                                   "parentId": 10
                                }
                            ],
                           "config": {
                               "description": false,
                               "priority": true,
                               "date": true,
                               "repeat": false,
                               "subtasks": true
                            },
                           "repeat": {},
                           "mainId": 148,
                           "subId": 10,
                           "parentId": 3,
                           "date":"2023 - 10 - 18",
                           "time":"15: 00",
                           "priority":"medium",
                           "reminder": false,
                           "notifId": 70
                        }, {
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion - color - tertiary)",
                               "id": 0
                            },
                           "title":"Date passed",
                           "list": [],
                           "config": {
                               "description": false,
                               "priority": false,
                               "date": true,
                               "repeat": false,
                               "subtasks": false
                            },
                           "repeat": {},
                           "date":"2023 - 10 - 24",
                           "time":"10: 00",
                           "mainId": 148,
                           "subId": 11,
                           "parentId": 3
                        }, {
                           "isDone": false,
                           "developped": false,
                           "main": false,
                           "category": {
                               "name":"task",
                               "color":"var(--ion - color - tertiary)",
                               "id": 0
                            },
                           "title":"Repetitive task",
                           "list": [],
                           "config": {
                               "description": false,
                               "priority": false,
                               "date": false,
                               "repeat": true,
                               "subtasks": false
                            },
                           "repeat": {
                               "startDate":"2023 - 10 - 25",
                               "startTime":"19: 00",
                               "delayType":"week"
                            },
                           "mainId": 148,
                           "subId": 12,
                           "parentId": 3,
                           "reminder": true,
                           "notifId": 69
                        }
                    ],
                   "config": {
                       "description": false,
                       "priority": false,
                       "date": false,
                       "repeat": false,
                       "subtasks": true
                    },
                   "repeat": {},
                   "mainId": 148,
                   "subId": 3,
                   "parentId": 0
                }, {
                   "isDone": false,
                   "developped": false,
                   "main": false,
                   "category": {
                       "name":"task",
                       "color":"var(--ion - color - tertiary)",
                       "id": 0
                    },
                   "title":"A few more words",
                   "list": [],
                   "config": {
                       "description": true,
                       "priority": false,
                       "date": false,
                       "repeat": false,
                       "subtasks": false
                    },
                   "repeat": {},
                   "description":"This is my very first application and the very first version. \nI created it based on my needs.I hope it will meet yours! \nI have lots of ideas for future versions and I 'm sure you will too.\nMany thanks to Raphaël Perrin, who designed the application logos.\nI look forward to your feedback !",
                   "mainId": 148,
                   "subId": 4,
                   "parentId": 0
                }
            ],
           "config": {
               "description": true,
               "priority": true,
               "date": true,
               "repeat": false,
               "subtasks": true
            },
           "mainId": 148,
           "repeat": {},
           "description":"Welcome to the ConcepTask application.\nThis is a todo list application like no other.\nIt' s been designed to let you manage your projects in a different way. \nMore flexible, intuitive and complete",
           "priority":"high",
           "date":"2023 - 11 - 05",
           "time":"21: 00"
        }
    }
}


