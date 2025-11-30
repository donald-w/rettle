import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HelpComponent } from './help.component';

@Component({ template: '', standalone: false })
class DummyGameComponent {}

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpComponent, DummyGameComponent],
      imports: [RouterTestingModule.withRoutes([
        { path: 'game', component: DummyGameComponent }
      ])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate back to the game when button is clicked', async () => {
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    button?.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });
});
