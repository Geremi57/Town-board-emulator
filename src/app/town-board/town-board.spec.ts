import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TownBoard } from './town-board';

describe('TownBoard', () => {
  let component: TownBoard;
  let fixture: ComponentFixture<TownBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TownBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TownBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
