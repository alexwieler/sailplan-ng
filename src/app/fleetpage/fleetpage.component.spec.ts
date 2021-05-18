import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetpageComponent } from './fleetpage.component';

describe('FleetpageComponent', () => {
  let component: FleetpageComponent;
  let fixture: ComponentFixture<FleetpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
