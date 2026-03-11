import { Component, Signal } from '@angular/core';
import { isActive, IsActiveMatchOptions, Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true
})
export class HeaderComponent {
    private readonly exactMatchOptions: IsActiveMatchOptions = {
        paths: 'exact',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored'
    };

    private readonly isInMenu: Signal<boolean>;
    private readonly isInHelp: Signal<boolean>;

    constructor(private readonly router: Router) {
        this.isInMenu = isActive('/menu', router, this.exactMatchOptions);
        this.isInHelp = isActive('/help', router, this.exactMatchOptions);
    }

    goToMenuOrGame(): void {
        this.router.navigate([this.isInMenu() ? '/game' : '/menu']);
    }

    goToHelpOrGame(): void {
        this.router.navigate([this.isInHelp() ? '/game' : '/help']);
    }

    goToGame(): void {
        this.router.navigate(['/game']);
    }
}
