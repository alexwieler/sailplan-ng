import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphImuComponent } from './graph-imu.component';

describe('GraphImuComponent', () => {
  let component: GraphImuComponent;
  let fixture: ComponentFixture<GraphImuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphImuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphImuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
