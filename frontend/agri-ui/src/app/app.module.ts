import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExploitationsComponent } from './components/exploitations/exploitations.component';
import { ParcellesComponent } from './components/parcelles/parcelles.component';
import { CapteursComponent } from './components/capteurs/capteurs.component';
import { MeteoComponent } from './components/meteo/meteo.component';
import { AlertsComponent } from './components/alerts/alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    ExploitationsComponent,
    ParcellesComponent,
    CapteursComponent,
    MeteoComponent,
    AlertsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
