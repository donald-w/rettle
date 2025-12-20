import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { MenuComponent } from './menu.component';
import { SettingsService } from '../settings.service';
import { BehaviorSubject } from 'rxjs';
import { GameEngineService } from '../game-engine.service';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let router: Router;
  let location: Location;
  let colourAccessibilityModeSubject: BehaviorSubject<boolean>;
  let settingsServiceSpy: jasmine.SpyObj<Pick<SettingsService, 'setColourAccessibilityMode'>>;
  let newGameSpy: jasmine.Spy;
  let hasOngoingGameSpy: jasmine.Spy;

  beforeEach(async () => {
    colourAccessibilityModeSubject = new BehaviorSubject<boolean>(false);
    settingsServiceSpy = jasmine.createSpyObj<Pick<SettingsService, 'setColourAccessibilityMode'>>('SettingsService', [
      'setColourAccessibilityMode',
    ]);
    newGameSpy = jasmine.createSpy('newGame');
    hasOngoingGameSpy = jasmine.createSpy('hasOngoingGame');

    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [
        provideRouter([{ path: 'game', component: MenuComponent }]),
        provideLocationMocks(),
        {
          provide: SettingsService,
          useValue: {
            colourAccessibilityMode$: colourAccessibilityModeSubject.asObservable(),
            setColourAccessibilityMode: settingsServiceSpy.setColourAccessibilityMode,
          },
        },
        {
          provide: GameEngineService,
          useValue: {
            newGame: newGameSpy,
            hasOngoingGame: hasOngoingGameSpy,
          },
        },
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
    const buttonDe = fixture.debugElement.query(By.directive(RouterLink));
    const routerLink = buttonDe.injector.get(RouterLink);

    expect(routerLink.urlTree?.toString()).toBe('/game');
  });

  it('should navigate back to the game when button is clicked', async () => {
    const button = fixture.nativeElement.querySelector('button[routerlink]') as HTMLButtonElement | null;
    button?.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/game');
  });

  it('should render the colour accessibility mode toggle', () => {
    const native = fixture.nativeElement as HTMLElement;
    expect(native.textContent).toContain('Colour accessibility mode');
    expect(native.querySelector('input[type="checkbox"]')).toBeTruthy();
  });

  it('should reflect the current toggle value', () => {
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input.checked).toBeFalse();

    colourAccessibilityModeSubject.next(true);
    fixture.detectChanges();
    expect(input.checked).toBeTrue();
  });

  it('should call SettingsService when toggle changes', () => {
    const input = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(settingsServiceSpy.setColourAccessibilityMode).toHaveBeenCalledWith(true);
  });

  it('should start a new game when the button is clicked and no progress exists', async () => {
    hasOngoingGameSpy.and.returnValue(false);
    const newGameButton = fixture.nativeElement.querySelector('button.new-game') as HTMLButtonElement;

    newGameButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(hasOngoingGameSpy).toHaveBeenCalled();
    expect(newGameSpy).toHaveBeenCalled();
    expect(location.path()).toBe('/game');
  });

  it('should ask for confirmation when progress exists', async () => {
    hasOngoingGameSpy.and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(true);
    const newGameButton = fixture.nativeElement.querySelector('button.new-game') as HTMLButtonElement;

    newGameButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(window.confirm).toHaveBeenCalled();
    expect(newGameSpy).toHaveBeenCalled();
    expect(location.path()).toBe('/game');
  });

  it('should not start a new game if confirmation is declined', async () => {
    hasOngoingGameSpy.and.returnValue(true);
    spyOn(window, 'confirm').and.returnValue(false);
    const newGameButton = fixture.nativeElement.querySelector('button.new-game') as HTMLButtonElement;

    newGameButton.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(window.confirm).toHaveBeenCalled();
    expect(newGameSpy).not.toHaveBeenCalled();
    expect(location.path()).not.toBe('/game');
  });
});
