import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home'; // Change 1: Match the class name

describe('HomeComponent', () => { // Change 2
  let component: HomeComponent; // Change 3
  let fixture: ComponentFixture<HomeComponent>; // Change 4

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent] // Change 5
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent); // Change 6
    component = fixture.componentInstance;
    fixture.detectChanges(); // Use detectChanges instead of whenStable for a basic "should create" test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});