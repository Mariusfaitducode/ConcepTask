import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MaintodoSubtaskComponent } from './maintodo-subtask.component';

describe('MaintodoSubtaskComponent', () => {
  let component: MaintodoSubtaskComponent;
  let fixture: ComponentFixture<MaintodoSubtaskComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintodoSubtaskComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MaintodoSubtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
