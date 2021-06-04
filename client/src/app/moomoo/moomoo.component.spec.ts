import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoomooComponent } from './moomoo.component';

describe('MoomooComponent', () => {
  let component: MoomooComponent;
  let fixture: ComponentFixture<MoomooComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoomooComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoomooComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
