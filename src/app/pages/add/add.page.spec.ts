import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddPage } from './add.page';
import { NavController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user/user.service';
import { TaskService } from 'src/app/services/task/task.service';
import { SettingsService } from 'src/app/services/settings/settings.service';
import { of } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { User } from 'src/app/models/user';
import { TodoUtils } from 'src/app/utils/todo-utils';
import { Settings } from 'src/app/models/settings';
import { TestingModule } from 'src/app/test-helpers';

describe('AddPage', () => {
  let component: AddPage;
  let fixture: ComponentFixture<AddPage>;
  let navCtrlSpy: jasmine.SpyObj<NavController>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;
  let platformSpy: jasmine.SpyObj<Platform>;
  let translateSpy: jasmine.SpyObj<TranslateService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let settingsServiceSpy: jasmine.SpyObj<SettingsService>;

  beforeEach(async () => {
    const navCtrlSpyObj = jasmine.createSpyObj('NavController', ['navigateForward', 'back']);
    const routeSpyObj = jasmine.createSpyObj('ActivatedRoute', [], { params: of({}) });
    const platformSpyObj = jasmine.createSpyObj('Platform', ['backButton']);
    platformSpyObj.backButton = jasmine.createSpyObj('backButton', ['subscribeWithPriority']);
    const translateSpyObj = jasmine.createSpyObj('TranslateService', ['instant']);
    const userServiceSpyObj = jasmine.createSpyObj('UserService', ['getUser']);
    const taskServiceSpyObj = jasmine.createSpyObj('TaskService', ['getTodos', 'updateTodo', 'addTodo']);
    const settingsServiceSpyObj = jasmine.createSpyObj('SettingsService', ['getLocalSettings', 'initPage']);

    await TestBed.configureTestingModule({
      declarations: [ AddPage ],
      imports: [
        TestingModule
      ],
      providers: [
        { provide: NavController, useValue: navCtrlSpyObj },
        { provide: ActivatedRoute, useValue: routeSpyObj },
        { provide: Platform, useValue: platformSpyObj },
        { provide: TranslateService, useValue: translateSpyObj },
        { provide: UserService, useValue: userServiceSpyObj },
        { provide: TaskService, useValue: taskServiceSpyObj },
        { provide: SettingsService, useValue: settingsServiceSpyObj }
      ]
    }).compileComponents();

    navCtrlSpy = TestBed.inject(NavController) as jasmine.SpyObj<NavController>;
    routeSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    platformSpy = TestBed.inject(Platform) as jasmine.SpyObj<Platform>;
    translateSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    settingsServiceSpy = TestBed.inject(SettingsService) as jasmine.SpyObj<SettingsService>;

    userServiceSpy.getUser.and.returnValue(of(null));
    taskServiceSpy.getTodos.and.returnValue(of([]));
    settingsServiceSpy.getLocalSettings.and.returnValue( new Settings());
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a new Todo when no id is provided', fakeAsync(() => {
    routeSpy.params = of({});
    component.ngOnInit();
    tick();
    expect(component.modifyExistingTodo).toBeFalse();
    expect(component.newTodo).toBeTruthy();
    expect(component.newTodo.main).toBeTrue();
  }));

  it('should load existing Todo when id is provided', fakeAsync(() => {
    const mockTodo = new Todo();
    mockTodo.id = '123';
    mockTodo.title = 'Test Todo';
    taskServiceSpy.getTodos.and.returnValue(of([mockTodo]));
    routeSpy.params = of({ id: '123' });
    component.ngOnInit();
    tick();
    expect(component.modifyExistingTodo).toBeTrue();
    expect(component.newTodo).toEqual(mockTodo);
  }));

  it('should not allow saving todo without title', () => {
    component.newTodo = new Todo();
    component.newTodo.title = '';
    expect(component.canSaveTodo()).toBeFalse();
    component.newTodo.title = 'Test';
    expect(component.canSaveTodo()).toBeTrue();
  });

  it('should save new todo correctly', fakeAsync(() => {
    component.modifyExistingTodo = false;
    component.newTodo = new Todo();
    component.newTodo.title = 'New Todo';
    component.saveTodo();
    tick();
    expect(taskServiceSpy.addTodo).toHaveBeenCalledWith(component.newTodo);
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/home');
  }));

  it('should update existing todo correctly', fakeAsync(() => {
    component.modifyExistingTodo = true;
    component.newTodo = new Todo();
    component.newTodo.id = '123';
    component.newTodo.title = 'Updated Todo';
    component.saveTodo();
    tick();
    expect(taskServiceSpy.updateTodo).toHaveBeenCalledWith(component.newTodo);
    expect(navCtrlSpy.navigateForward).toHaveBeenCalledWith('/todo/123');
  }));

  it('should show confirmation dialog when closing with unsaved changes', fakeAsync(() => {
    spyOn(TodoUtils, 'areSameTodos').and.returnValue(false);
    spyOn(component, 'showCloseConfirm');
    component.setupBackButtonHandler();
    // platformSpy.backButton.subscribeWithPriority.calls.mostRecent().args[1]();
    tick();
    expect(component.showCloseConfirm).toHaveBeenCalled();
  }));

  it('should assign ids correctly', () => {
    component.newTodo = new Todo();
    component.newTodo.list = [
      new Todo(), new Todo()
    ];
    component.assignIds();
    expect(component.newTodo.list[0].subId).toBe(1);
    expect(component.newTodo.list[0].list[0].subId).toBe(2);
    expect(component.newTodo.list[1].subId).toBe(3);
  });

  // Add more tests as needed for other methods and edge cases
});
