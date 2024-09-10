import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodoSubTasksHeaderComponent } from './todo-sub-tasks-header.component';

describe('TodoSubTasksHeaderComponent', () => {
  let component: TodoSubTasksHeaderComponent;
  let fixture: ComponentFixture<TodoSubTasksHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoSubTasksHeaderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoSubTasksHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
