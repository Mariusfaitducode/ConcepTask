import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TodoSubtasksTreeComponent } from './todo-subtasks-tree.component';

describe('TodoSubtasksTreeComponent', () => {
  let component: TodoSubtasksTreeComponent;
  let fixture: ComponentFixture<TodoSubtasksTreeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoSubtasksTreeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoSubtasksTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
