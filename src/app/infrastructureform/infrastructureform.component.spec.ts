
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureformComponent } from './infrastructureform.component';

describe('BuoyformComponent', () => {
  let component: InfrastructureformComponent;
  let fixture: ComponentFixture<InfrastructureformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrastructureformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
