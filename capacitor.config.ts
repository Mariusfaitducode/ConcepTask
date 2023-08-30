import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'fr.marscode.todolist',
  appName: 'ToDoList',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
