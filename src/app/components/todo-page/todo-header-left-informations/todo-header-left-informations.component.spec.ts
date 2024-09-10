import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodoHeaderLeftInformationsComponent } from './todo-header-left-informations.component';

describe('TodoHeaderLeftInformationsComponent', () => {
  let component: TodoHeaderLeftInformationsComponent;
  let fixture: ComponentFixture<TodoHeaderLeftInformationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoHeaderLeftInformationsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoHeaderLeftInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
