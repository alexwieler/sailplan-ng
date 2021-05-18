import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselformComponent } from './vesselform.component';

describe('VesselformComponent', () => {
  let component: VesselformComponent;
  let fixture: ComponentFixture<VesselformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
