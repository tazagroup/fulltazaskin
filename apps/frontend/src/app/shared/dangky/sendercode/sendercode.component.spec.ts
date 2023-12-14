import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendercodeComponent } from './sendercode.component';

describe('SendercodeComponent', () => {
  let component: SendercodeComponent;
  let fixture: ComponentFixture<SendercodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendercodeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SendercodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
