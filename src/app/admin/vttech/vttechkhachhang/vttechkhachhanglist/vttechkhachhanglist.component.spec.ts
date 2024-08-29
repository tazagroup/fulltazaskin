/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VttechkhachhanglistComponent } from './vttechkhachhanglist.component';

describe('VttechkhachhanglistComponent', () => {
  let component: VttechkhachhanglistComponent;
  let fixture: ComponentFixture<VttechkhachhanglistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VttechkhachhanglistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VttechkhachhanglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
