import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HelpComponent } from './help/help.component';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  { path: 'game', component: GameComponent },
  { path: 'help', component: HelpComponent },
  { path: 'menu', component: MenuComponent },
];
