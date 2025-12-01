import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([{ path: 'game', component: MenuComponent }]),
        provideLocationMocks(),
      ],
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

  it('should render menu copy', () => {
    const native = fixture.nativeElement as HTMLElement;
    expect(native.querySelector('h1')?.textContent?.trim()).toBe('Menu');
    expect(native.querySelector('p')?.textContent).toContain('Game settings');
  });

  it('should link back to the game', () => {
    const buttonDe = fixture.debugElement.query(By.css('button'));
    const routerLink = buttonDe.injector.get(RouterLink);

    expect(routerLink.urlTree?.toString()).toBe('/game');
  });

  it('should navigate back to the game when button is clicked', async () => {
    const button: HTMLButtonElement | null = fixture.nativeElement.querySelector('button');
    button?.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });
});
