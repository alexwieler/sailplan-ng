import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleGraphComponent } from './sample-graph.component';

describe('SampleGraphComponent', () => {
  let component: SampleGraphComponent;
  let fixture: ComponentFixture<SampleGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
