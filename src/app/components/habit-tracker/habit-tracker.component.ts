import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-habit-tracker',
  templateUrl: './habit-tracker.component.html',
  styleUrls: ['./habit-tracker.component.scss'],
})
export class HabitTrackerComponent  implements OnInit {

  constructor() { }


  days : string[] = ["M", "T", "W", "T", "F", "S", "S"];

  ngOnInit() {}

}
