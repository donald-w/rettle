import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuComponent } from './menu.component';

@Component({ template: '', standalone: true })
class DummyGameComponent {}

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'game', component: DummyGameComponent }
      ]), MenuComponent, DummyGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
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
