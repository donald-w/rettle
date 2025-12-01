import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { HelpComponent } from './help.component';

@Component({ template: '', standalone: true })
class DummyGameComponent {}

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpComponent, DummyGameComponent],
      providers: [
        provideRouter([{ path: 'game', component: DummyGameComponent }]),
        provideLocationMocks(),
      ]
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

  it('should render help copy', () => {
    const native = fixture.nativeElement as HTMLElement;
    expect(native.querySelector('h1')?.textContent?.trim()).toBe('Help');
    expect(native.querySelector('p')?.textContent).toContain('Learn how to play');
  });

  it('should link back to the game', () => {
    const buttonDe = fixture.debugElement.query(By.css('button'));
    const routerLink = buttonDe.injector.get(RouterLink);

    expect(routerLink.urlTree?.toString()).toBe('/game');
  });

  it('should navigate back to the game when button is clicked', async () => {
    const button = fixture.debugElement.query(By.css('button')).nativeElement as HTMLButtonElement;

    button.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });
});
