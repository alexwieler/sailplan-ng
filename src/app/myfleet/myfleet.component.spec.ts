import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyfleetComponent } from './myfleet.component';

describe('MyfleetComponent', () => {
  let component: MyfleetComponent;
  let fixture: ComponentFixture<MyfleetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyfleetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyfleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
