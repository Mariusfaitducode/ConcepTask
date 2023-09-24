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
    { key: 'repeat', value: false },
    { key: 'sub tasks', value: false },
    // { key: 'sub tasks', value: false },
  ];

  constructor() { }

  ngOnInit() {}


  selectConfig(item : { key: string, value: boolean}){
    item.value = true;

    if (item.key == 'date'){
      this.configArray.find(item => item.key === 'repeat')!.value = false;
    }
    if (item.key == 'repeat'){
      this.configArray.find(item => item.key === 'date')!.value = false;
    }
  }

}
