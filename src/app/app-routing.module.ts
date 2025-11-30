import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { HelpComponent } from './help/help.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'game' },
  { path: 'game', component: GameComponent },
  { path: 'help', component: HelpComponent },
  { path: 'menu', component: MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
