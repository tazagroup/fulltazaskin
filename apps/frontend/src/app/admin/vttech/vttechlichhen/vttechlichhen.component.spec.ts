/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VttechlichhenComponent } from './vttechlichhen.component';

describe('VttechlichhenComponent', () => {
  let component: VttechlichhenComponent;
  let fixture: ComponentFixture<VttechlichhenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VttechlichhenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VttechlichhenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
