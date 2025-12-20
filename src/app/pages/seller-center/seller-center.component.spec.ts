import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCenterComponent } from './seller-center.component';

describe('SellerCenterComponent', () => {
  let component: SellerCenterComponent;
  let fixture: ComponentFixture<SellerCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellerCenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
