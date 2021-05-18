import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureviewComponent } from './infrastructureview.component';

describe('InfrastructureviewComponent', () => {
  let component: InfrastructureviewComponent;
  let fixture: ComponentFixture<InfrastructureviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfrastructureviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
