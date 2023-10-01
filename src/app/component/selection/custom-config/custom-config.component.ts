import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-custom-config',
  templateUrl: './custom-config.component.html',
  styleUrls: ['./custom-config.component.scss'],
})
export class CustomConfigComponent  implements OnInit {


  @Input() configArray: any;

  constructor() { }

  ngOnInit() {}


  toggleConfig(key : string){
    
    this.configArray[key] = !this.configArray[key];

  }

}
