import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructurespageComponent } from './infrastructurespage.component';

describe('InfrastructurespageComponent', () => {
  let component: InfrastructurespageComponent;
  let fixture: ComponentFixture<InfrastructurespageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrastructurespageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructurespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
