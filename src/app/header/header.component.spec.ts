import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: '', redirectTo: 'game', pathMatch: 'full' },
        { path: 'game', component: DummyComponent },
        { path: 'help', component: DummyComponent },
        { path: 'menu', component: DummyComponent }
      ]), HeaderComponent, DummyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header .title-button')?.textContent?.trim()).toBe('RETTLE');
  });

  it('should navigate to game when menu is clicked on menu page', async () => {
    await router.navigate(['/menu']);
    fixture.detectChanges();

    const menuButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[aria-label="Menu"]');
    menuButton?.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });

  it('should navigate to game when help is clicked on help page', async () => {
    await router.navigate(['/help']);
    fixture.detectChanges();

    const helpButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button[aria-label="Help"]');
    helpButton?.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });

  it('should navigate to game when title is clicked', async () => {
    await router.navigate(['/menu']);
    fixture.detectChanges();

    const titleButton: HTMLButtonElement | null = fixture.nativeElement.querySelector('button.title-button');
    titleButton?.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });
});
