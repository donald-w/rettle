import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let routerNavigateSpy: jasmine.Spy;
  let activeRoute: string;

  beforeEach(async () => {
    activeRoute = '/game';
    const mockRouter: Partial<Router> = {
      navigate: routerNavigateSpy = jasmine.createSpy('navigate'),
      isActive: (url: string) => url === activeRoute,
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header .title-button')?.textContent?.trim()).toBe('RETTLE');
  });

  it('should navigate to menu when menu icon clicked from game', () => {
    activeRoute = '/game';
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(By.css('button[aria-label="Menu"]')).nativeElement as HTMLButtonElement;
    menuButton.click();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/menu']);
  });

  it('should navigate to game when menu icon clicked from menu', () => {
    activeRoute = '/menu';
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(By.css('button[aria-label="Menu"]')).nativeElement as HTMLButtonElement;
    menuButton.click();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/game']);
  });

  it('should navigate to help when help icon clicked from game', () => {
    activeRoute = '/game';
    fixture.detectChanges();

    const helpButton = fixture.debugElement.query(By.css('button[aria-label="Help"]')).nativeElement as HTMLButtonElement;
    helpButton.click();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/help']);
  });

  it('should navigate to game when help icon clicked from help', () => {
    activeRoute = '/help';
    fixture.detectChanges();

    const helpButton = fixture.debugElement.query(By.css('button[aria-label="Help"]')).nativeElement as HTMLButtonElement;
    helpButton.click();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/game']);
  });

  it('should navigate to game when title is clicked', () => {
    const titleButton = fixture.debugElement.query(By.css('button.title-button')).nativeElement as HTMLButtonElement;
    titleButton.click();

    expect(routerNavigateSpy).toHaveBeenCalledWith(['/game']);
  });
});
