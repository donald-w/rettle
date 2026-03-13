import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';

@Component({ template: '', standalone: true })
class DummyComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([
          { path: 'game', component: DummyComponent },
          { path: 'menu', component: DummyComponent },
          { path: 'help', component: DummyComponent },
        ]),
      ],
    })
    .compileComponents();

    router = TestBed.inject(Router);
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

  it('should navigate to menu when menu icon clicked from game', async () => {
    await router.navigateByUrl('/game');
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(By.css('button[aria-label="Menu"]')).nativeElement as HTMLButtonElement;
    menuButton.click();
    await vi.waitFor(() => expect(router.url).toBe('/menu'));

  });

  it('should navigate to game when menu icon clicked from menu', async () => {
    await router.navigateByUrl('/menu');
    fixture.detectChanges();

    const menuButton = fixture.debugElement.query(By.css('button[aria-label="Menu"]')).nativeElement as HTMLButtonElement;
    menuButton.click();
    await vi.waitFor(() => expect(router.url).toBe('/game'));

  });

  it('should navigate to help when help icon clicked from game', async () => {
    await router.navigateByUrl('/game');
    fixture.detectChanges();

    const helpButton = fixture.debugElement.query(By.css('button[aria-label="Help"]')).nativeElement as HTMLButtonElement;
    helpButton.click();
    await vi.waitFor(() => expect(router.url).toBe('/help'));

  });

  it('should navigate to game when help icon clicked from help', async () => {
    await router.navigateByUrl('/help');
    fixture.detectChanges();

    const helpButton = fixture.debugElement.query(By.css('button[aria-label="Help"]')).nativeElement as HTMLButtonElement;
    helpButton.click();
    await vi.waitFor(() => expect(router.url).toBe('/game'));

  });

  it('should navigate to game when title is clicked', async () => {
    await router.navigateByUrl('/menu');
    fixture.detectChanges();

    const titleButton = fixture.debugElement.query(By.css('button.title-button')).nativeElement as HTMLButtonElement;
    titleButton.click();
    await vi.waitFor(() => expect(router.url).toBe('/game'));

  });
});
