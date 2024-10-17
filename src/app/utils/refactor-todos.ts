import { Todo } from "../models/todo";
import { MainTodo } from "../models/todo/main-todo";
import { SubTodo } from "../models/todo/sub-todo";
import { TodoProperties } from "../models/todo/todo-properties";

export class RefactorTodos {
    public static refactorTodos(todos: Todo[]): MainTodo[] {
        const mainTodos: MainTodo[] = [];

        for (const todo of todos) {
            if (!todo.parentId) {
                const mainTodo = new MainTodo(todo.id);
                this.copyTodoProperties(todo, mainTodo.properties);
                mainTodo.list = this.refactorSubTodos(todo.list);
                mainTodos.push(mainTodo);
            }
        }

        return mainTodos;
    }

    private static refactorSubTodos(subTodos: Todo[]): SubTodo[] {
        return subTodos.map(subTodo => {
            const newSubTodo = new SubTodo(subTodo.id);
            this.copyTodoProperties(subTodo, newSubTodo.properties);
            newSubTodo.subId = subTodo.subId;
            newSubTodo.parentId = subTodo.parentId;
            newSubTodo.list = this.refactorSubTodos(subTodo.list);
            return newSubTodo;
        });
    }

    private static copyTodoProperties(oldTodo: Todo, newProperties: TodoProperties): void {
        newProperties.welcomeTodo = oldTodo.welcomeTodo;
        newProperties.isDone = oldTodo.isDone;
        newProperties.developped = oldTodo.developped;
        newProperties.config = oldTodo.config;
        newProperties.title = oldTodo.title;
        newProperties.category = oldTodo.category;
        newProperties.description = oldTodo.description;
        newProperties.priority = oldTodo.priority;
        newProperties.date = oldTodo.date;
        newProperties.time = oldTodo.time;
        newProperties.reminder = oldTodo.reminder;
        newProperties.notifId = oldTodo.notifId;
        newProperties.repeat = oldTodo.repeat;
    }
}
