import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-config',
  templateUrl: './custom-config.component.html',
  styleUrls: ['./custom-config.component.scss'],
})
export class CustomConfigComponent  implements OnInit {


  @Input() configArray: { key: string, value: boolean }[] = [
    { key: 'description', value: false },
    { key: 'date', value: false },
    { key: 'time', value: false },
    { key: 'repetition', value: false },
    { key: 'sub tasks', value: false },
    // { key: 'sub tasks', value: false },
  ];



  constructor() { }

  ngOnInit() {}

}
