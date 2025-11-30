import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameComponent } from './game/game.component';
import { LetterComponent } from './letter/letter.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { KeyComponent } from './key/key.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';

@NgModule({ declarations: [
        AppComponent,
        GameComponent,
        LetterComponent,
        KeyboardComponent,
        KeyComponent,
        HeaderComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
