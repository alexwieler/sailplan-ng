import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInfrastructuresComponent } from './myinfrastructures.component';

describe('MyInfrastructuresComponent', () => {
  let component: MyInfrastructuresComponent;
  let fixture: ComponentFixture<MyInfrastructuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyInfrastructuresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInfrastructuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
