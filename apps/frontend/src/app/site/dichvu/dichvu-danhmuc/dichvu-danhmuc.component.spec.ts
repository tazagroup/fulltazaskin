/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DichvuDanhmucComponent } from './dichvu-danhmuc.component';

describe('DichvuDanhmucComponent', () => {
  let component: DichvuDanhmucComponent;
  let fixture: ComponentFixture<DichvuDanhmucComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DichvuDanhmucComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DichvuDanhmucComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
