import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DoneTaskPage } from './done-task.page';
import { TestingModule } from 'src/app/test-helpers';

describe('DoneTaskPage', () => {
  let component: DoneTaskPage;
  let fixture: ComponentFixture<DoneTaskPage>;

  beforeEach(async(async () => {

    await TestBed.configureTestingModule({
      declarations: [DoneTaskPage],
      imports: [
        TestingModule
      ],
    }).compileComponents();


    fixture = TestBed.createComponent(DoneTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
