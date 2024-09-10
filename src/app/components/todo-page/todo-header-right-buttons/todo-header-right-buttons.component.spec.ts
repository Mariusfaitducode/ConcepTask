import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodoHeaderRightButtonsComponent } from './todo-header-right-buttons.component';

describe('TodoHeaderRightButtonsComponent', () => {
  let component: TodoHeaderRightButtonsComponent;
  let fixture: ComponentFixture<TodoHeaderRightButtonsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoHeaderRightButtonsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoHeaderRightButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
