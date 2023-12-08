import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DoneTaskPage } from './done-task.page';

describe('DoneTaskPage', () => {
  let component: DoneTaskPage;
  let fixture: ComponentFixture<DoneTaskPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DoneTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
