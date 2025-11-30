import { Component } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';

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

    constructor(private readonly router: Router) {}

    goToMenuOrGame(): void {
        this.router.navigate([this.isInMenu ? '/game' : '/menu']);
    }

    goToHelpOrGame(): void {
        this.router.navigate([this.isInHelp ? '/game' : '/help']);
    }

    goToGame(): void {
        this.router.navigate(['/game']);
    }

    private get isInMenu(): boolean {
        return this.router.isActive('/menu', this.exactMatchOptions);
    }

    private get isInHelp(): boolean {
        return this.router.isActive('/help', this.exactMatchOptions);
    }
}
