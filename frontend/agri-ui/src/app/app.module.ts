import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ExploitationsComponent } from './components/exploitations/exploitations.component';
import { ParcellesComponent } from './components/parcelles/parcelles.component';
import { CapteursComponent } from './components/capteurs/capteurs.component';
import { MeteoComponent } from './components/meteo/meteo.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ExploitationsComponent,
    ParcellesComponent,
    CapteursComponent,
    MeteoComponent,
    AlertsComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
